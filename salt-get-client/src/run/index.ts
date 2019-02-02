import {CronJob} from 'cron'
import { RunCommand } from '../command'
import { getDistanceMeasurer } from '../distance-measure'

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

export const run = async (command: RunCommand) => {
  console.log('running command', command)
  const getDistance = getDistanceMeasurer(command.triggerPin, command.echoPin)
  new CronJob(command.cron, async () => {
    console.log('running command as scheduled', new Date().toISOString())
    const distances = await getDistances(command.readCount, getDistance)
    console.log(distances)
    console.log(distances.length)
  }).start()
}
