import {Gpio, Direction} from 'onoff';
import {timer, from, of, BehaviorSubject} from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';


// const sleep = (time: number) => new Promise<void>((accept) => setInterval(accept, time));
const getIo = (num: number, dir: Direction, edge: boolean) => {
  const io = new Gpio(num, dir, edge ? 'both' : 'none');
  const read = () => new Promise<number>((accept, reject) => io.read((error, value) => error ? reject(error) : accept(value)));
  const write = (value: number) => new Promise((accept, reject) => io.write(value, (error, value) => error ? reject(error) : accept(value)));
  const subj = new BehaviorSubject<number>(0);
  io.watch((error, value) => {
    error ? subj.error(error) : subj.next(value);
  });
  const watch = subj.asObservable();
  return {read, write, watch};
};

const trigger = getIo(5, 'out', false);
const echo = getIo(6, 'in', true);

echo.watch.subscribe((value) => {
  console.log('echo: ' + value);
});
(async () => {
  await trigger.write(1);
  await trigger.write(0);
})();
