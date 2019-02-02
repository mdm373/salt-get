import { getPin, IODirection, IOLevel } from '../gpio'

const microsecondsPerCm = 1e6 / 34321

export const getDistanceMeasurer = (triggerPin: number, echoPin: number) => {
  const trigger = getPin(triggerPin, IODirection.out, false)
  const echo = getPin(echoPin, IODirection.in, true)
  return async () => {
    const watchProm = new Promise<number>((accept) => {
      const echoWatch = echo.watch()
      const subscription = echoWatch.observable.subscribe((data) => {
        if (data.delta && data.level === IOLevel.low) {
          echoWatch.stop()
          subscription.unsubscribe()
          accept(data.delta / 2 / microsecondsPerCm)
        }
      })
    })
    const [distance] = await Promise.all([watchProm, trigger.trigger(IOLevel.high, 10)])
    return distance
  }
}
