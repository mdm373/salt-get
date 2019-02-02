export interface RunCommand {
  readonly cron: string
  readonly echoPin: number
  readonly triggerPin: number,
  readonly consoleMode: boolean,
  readonly min: number,
  readonly max: number,
  readonly deviceId: string,
  readonly stndDv: number,
  readonly readCount: number
}

export const getCommand = (input: any) => {
  const cmd: RunCommand = {
    deviceId: input.deviceId,
    cron: input.cron || '0 0 12 * *',
    echoPin: Number(input.echoPin || '15'),
    triggerPin: Number(input.echoPin || '14'),
    max: Number(input.max || '30'),
    min: Number(input.min || '10'),
    readCount: Number(input.readCount || '30'),
    stndDv: Number(input.stndDv || '1'),
    consoleMode: !!input.consoleMode,
  }
  if (cmd.triggerPin < 3 || cmd.triggerPin > 40) {
    throw new Error('invalid trigger pin')
  }
  if (cmd.echoPin < 3 || cmd.echoPin > 40) {
    throw new Error('invalid echo pin')
  }
  if (cmd.max <= cmd.min || cmd.max < 0 || cmd.min < 0) {
    throw new Error('invalid min max range')
  }
  if (cmd.stndDv < .0001) {
    throw new Error('invalid burst standard deviation')
  }
  if (cmd.readCount < 1) {
    throw new Error('invalid burst read count')
  }
  return cmd
}
