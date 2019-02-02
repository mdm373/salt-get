import {Credentials, Lambda} from 'aws-sdk'

export const invokeLambda = async <T>(funcName: string, event: any, credentials: Credentials) => {
  const lambda = new Lambda({credentials, region: 'us-east-1'})
  const request: Lambda.InvocationRequest = {
      FunctionName: funcName,
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(event),
    }
  const result = await lambda.invoke(request).promise()
  if (result.LogResult) {
    const logs = Buffer.from(result.LogResult, 'base64').toString('UTF-8')
    console.log('lambda log', logs)
  }
  const payload = JSON.parse(result.Payload as string) || {}
  if (payload.errorMessage) {
      throw new Error(payload)
  }
  return payload as T
}
