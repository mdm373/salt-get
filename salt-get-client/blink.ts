import {from, of, timer} from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { getPin, IODirection } from "./gpio";

const led = getPin(4, IODirection.out, false);

timer(1000, 1000).pipe(
  switchMap(() => from(led.read())),
  switchMap((value) => {
    const newValue = value === 0 ? 1 : 0;
    return from(led.write(newValue).then(() => newValue));
  }),
  map((newValue) => newValue === 0 ? "off" : "on"),
  catchError((error) => of("!!ERROR!!" + JSON.stringify(error))),
).subscribe((updatedValue) => {
  console.log(`blinking: ${updatedValue}`);
});
