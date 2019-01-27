import {Command} from "commander";
import {from, timer} from "rxjs";
import { switchMap } from "rxjs/operators";
import { getDistanceMeasurer } from "./distance-measure";

const program = new Command("");
  // tslint:disable-next-line:no-var-requires
program.version(require("../package.json").version);
program.command("run")
  .option("-i, --interval <n>", "interval in milliseconds", parseInt)
  .option("-t, --triggerPin <n>", "trigger pin number", parseInt)
  .option("-e, --echoPin <n>", "echo pin number", parseInt)
  .action(async (command) => {
    const echoPin = Number(command.echoPin || "6");
    const triggerPin = Number(command.triggerPin || "5");
    const interval = Number(command.interval || "5000");
    console.log("running with", echoPin, triggerPin, interval);
    const getDistance = getDistanceMeasurer(triggerPin, echoPin);
    timer(interval, interval).pipe(
      switchMap( () => from(getDistance())),
    ).subscribe((distance) => {
      console.clear();
      console.log("distance", distance);
    });
  });
program.parse(process.argv);
