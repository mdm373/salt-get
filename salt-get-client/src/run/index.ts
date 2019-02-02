import { Credentials } from 'aws-sdk'
import { CronJob } from 'cron'
import { Stats } from 'fast-stats'
import { RunCommand } from '../command'
import { getDistanceMeasurer } from '../distance-measure'
import { invokeLambda } from '../invoke-lambda'

const distanceReadError = (error: Error) => console.log('distance read error', error)

const getDistances = async (count: number, getDistance: () => Promise<number>) => {
  const distances: number[] = []
  const pushDistance = distances.push.bind(distances)
  await Array(count).fill(1).reduce(
    (agg) => agg.then(getDistance).then(pushDistance).catch(distanceReadError),
    Promise.resolve(),
  )
  return distances.filter((distance) => distance > 0)
}

const getAvtMean = (distances: number[], stdDevs: number) => {
  const stats = new Stats()
  stats.push(distances)
  const stdDev = stats.stddev()
  const scaledStdDev = stdDevs * stdDev
  const mean = stats.amean()
  const banded = stats.band_pass(mean - scaledStdDev, mean + scaledStdDev)
  return Number(banded.amean().toFixed(3))
}

export const run = async (command: RunCommand) => {
  console.log('running command', {...command, ...{awsSecret: '****'}})
  const getDistance = getDistanceMeasurer(command.triggerPin, command.echoPin)
  new CronJob(command.cron, async () => {
    try {
      console.log('running command as scheduled', new Date().toISOString())
      const distances = await getDistances(command.readCount, getDistance)
      const avtMean = getAvtMean(distances, command.stndDv)
      console.log({avtMean})
      const normalizedMean = Math.max(Math.min(avtMean, command.max), command.min)
      const historyEntry: any = {
        deviceId: command.deviceId,
        distanceCurrent: normalizedMean,
        distanceMax: command.max,
        distanceMin: command.min,
      }
      console.log({historyEntry})
      if (!command.consoleMode) {
        const credentials = new Credentials({accessKeyId: command.awsKey, secretAccessKey: command.awsSecret})
        const pushResponse = await invokeLambda('salt-get-push', historyEntry, credentials)
        console.log({pushResponse})
      } else {
        console.log('push skipped for console mode')
      }
    } catch (error) {
      console.error('error running scheduled command', error)
    }
  }).start()
}
