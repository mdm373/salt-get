import {Subject, timer, from} from 'rxjs';
import {Gpio, tickDiff} from 'pigpio';
import { switchMap } from 'rxjs/operators';

enum IODirection {in=0, out=1};
enum IOLevel {low=0, high=1};
interface WatchData {
  readonly level: number;
  readonly tick: number;
  readonly delta?: number;
}
const sleep = (time: number) => new Promise<void>((accept) => setInterval(accept, time));
const getIo = (num: number, dir: IODirection, edge: boolean) => {
  const io = new Gpio(num, {mode: dir, alert: edge});
  const read = () => new Promise<number>((accept) => accept(io.digitalRead()));
  const write = (value: number) => new Promise<void>((accept) => {
    io.digitalWrite(value)
    accept();
  });
  const subj = new Subject<WatchData>();
  let lastTick: number;
  io.on('alert', (level:number, tick:number) => {
    const delta = lastTick === undefined ? undefined: tickDiff(lastTick, tick)
    subj.next({level, tick,delta});
  });
  const trigger = async (level: IOLevel, duration: number) => {
    await write(level === IOLevel.high ? IOLevel.low : IOLevel.high);
    io.trigger(duration, level)
  };
  const watch = subj.asObservable();
  return {read, write, watch, trigger};
};

const microsecondsPerCm = 1e6/34321;
(async () => {
  const trigger = getIo(5, IODirection.out, false);
  const echo = getIo(6, IODirection.in, true);
  echo.watch.subscribe((data) => {
    console.log('echo value', data);
    if(data.delta){
      console.log(`distance is '${data.delta/2/microsecondsPerCm}' cm`);
    }
  });
  timer(5000, 5000).pipe(
    switchMap( () => from(trigger.trigger(IOLevel.high, 10)))
  ).subscribe();
})();
