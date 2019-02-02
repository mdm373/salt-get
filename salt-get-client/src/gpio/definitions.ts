import { Observable } from 'rxjs'

export enum IODirection {in= 0, out= 1}
export enum IOLevel {low= 0, high= 1}
export interface WatchData {
  readonly level: number
  readonly tick: number
  readonly delta?: number
}
export interface GpioPin {
  read: () => Promise<number>
  write: (value: number) => Promise<void>
  watch: () => {observable: Observable<WatchData>, stop: () => void}
  trigger: (level: IOLevel, duration: number) => Promise<void>
}
export type PinProvider = (num: number, dir: IODirection, edge: boolean) => GpioPin
