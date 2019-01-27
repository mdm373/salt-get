import {Gpio} from "onoff";
import {from, of, timer} from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";

const led = new Gpio(4, "out");
const readLed = () => new Promise<number>((accept, reject) =>
  led.read((error, value) => error ? reject(error) : accept(value)));
const writeLed = (value: number) =>
  new Promise((accept, reject) => led.write(value, (error, writeVal) => error ? reject(error) : accept(writeVal)));

timer(1000, 1000).pipe(
  switchMap(() => from(readLed())),
  switchMap((value) => {
    const newValue = value === 0 ? 1 : 0;
    return from(writeLed(newValue));
  }),
  map((newValue) => newValue === 0 ? "off" : "on"),
  catchError((error) => of("!!ERROR!!" + JSON.stringify(error))),
).subscribe((updatedValue) => {
  console.log(`blinking: ${updatedValue}`);
});
