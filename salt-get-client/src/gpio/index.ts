
import {GpioPin, IODirection, IOLevel, PinProvider, WatchData} from "./definitions";
const isMock = process.env.NODE_ENV === "test";
if (isMock) {
  console.warn("using mock gpio");
}
// tslint:disable-next-line:no-var-requires
const getPin = (isMock ? require("./gpio-mock").getMockPin : require("./gpio").getPiGpioPin) as PinProvider;
export {IODirection, IOLevel, WatchData, PinProvider, GpioPin, getPin};
