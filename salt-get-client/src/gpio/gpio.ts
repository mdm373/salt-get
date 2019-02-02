import { Gpio, tickDiff } from 'pigpio'
import { Subject } from 'rxjs'
import { IOLevel, PinProvider, WatchData } from './definitions'

export const getPiGpioPin: PinProvider = (num, dir, edge) => {
  const io = new Gpio(num, {mode: dir, alert: edge})
  const read = () => new Promise<number>((accept) => accept(io.digitalRead()))
  const write = (value: number) => new Promise<void>((accept) => {
    io.digitalWrite(value)
    accept()
  })
  const trigger = async (level: IOLevel, duration: number) => {
    await write(level === IOLevel.high ? IOLevel.low : IOLevel.high)
    io.trigger(duration, level)
  }
  const watch = () => {
    const subj = new Subject<WatchData>()
    let lastTick: number
    const listener = (level: number, tick: number) => {
      const delta = lastTick === undefined ? undefined : tickDiff(lastTick, tick)
      lastTick = tick
      subj.next({level, tick, delta})
    }
    io.on('alert', listener)
    const observable = subj.asObservable()
    const stop = () => io.removeListener('alert', listener)
    return {observable, stop}
  }
  return {read, write, watch, trigger}
}
