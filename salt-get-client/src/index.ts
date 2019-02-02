import {Command} from 'commander'
import { getCommand } from './command'
import { run } from './run'

const program = new Command('')
  // tslint:disable-next-line:no-var-requires
program.version(require('../package.json').version)
program.command('run')
  .option('-d, --deviceId <s>', 'id of the reading device')
  .option('-c, --cron [s]', 'cron interval for readings. defaults to everyday at noon')
  .option('-t, --triggerPin [n]', 'trigger pin number. defaults to 14', parseInt)
  .option('-e, --echoPin [n]', 'echo pin number. defaults to 15', parseInt)
  .option('-m, --min [n]', 'distance in cm when barrel is full. default is 10cm', parseInt)
  .option('-M, --max [n]', 'distance in cm when barrel is empty. default is 30cm', parseInt)
  .option('-r --readCount [n]', 'number of readings in burst. default is 30', parseInt)
  .option('-s --stndDv [n]', 'standard deviations for burst filter. default is 1', parseInt)
  .option('-C, --consoleMode', 'log to console instead of lambda invoke')
  .action(async (input) => {
    const command = getCommand(input)
    await run(command)
  })
program.parse(process.argv)
