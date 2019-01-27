import { noop, ReplaySubject } from "rxjs";
import { IOLevel, PinProvider, WatchData } from "./definitions";

const pinStreams: {[key: number]: WatchData[]} = {
  6: [{level: 1, tick: 3356606804, delta: undefined}, {level: 0, tick: 3356614079, delta: 7275}],
};

export const getMockPin: PinProvider = (num, dir, edge) => {
  console.log("creating mock pin", num, dir, edge);
  let pinVal = 0;
  const read = () => new Promise<number>((accept) => accept(pinVal));
  const write = (value: number) => new Promise<void>((accept) => {
    pinVal = value;
    console.log("pin set to", pinVal);
    accept();
  });
  const trigger = async (level: IOLevel, duration: number) => {
    console.log("triggering for", level, duration);
  };
  const watch = () => {
    const subj = new ReplaySubject<WatchData>();
    if (pinStreams[num]) {
      const copy = pinStreams[num].slice();
      const clear = setInterval(() => copy[0] ? subj.next(copy.pop()) : clearInterval(clear), 1000);
    }
    return {observable: subj.asObservable(), stop: noop};
  };
  return {read, write, watch, trigger};
};
