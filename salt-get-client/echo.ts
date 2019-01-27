import {from, timer} from "rxjs";
import { switchMap } from "rxjs/operators";
import { getDistanceMeasurer } from "./distance-measure";

const getDistance = getDistanceMeasurer(5, 6);

(async () => {
  timer(5000, 5000).pipe(
    switchMap( () => from(getDistance())),
  ).subscribe((distance) => {
    console.log("distance", distance);
  });
})();
