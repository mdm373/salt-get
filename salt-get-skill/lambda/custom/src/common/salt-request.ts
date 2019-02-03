import { DynamoDB } from 'aws-sdk'
import moment from 'moment'
import { MetadataEntry } from '../../../../../salt-get-dynamo/dist/metadata-entry'

const deviceNotFoundText = 'Ullgh, I can\'t figure out where salt is need get'
const dynamoClient = new DynamoDB.DocumentClient()
const deviceId = process.env.DEVICE_ID
if (!deviceId) {
  throw new Error('device id not defined')
}

const getSpeechText = (entry: MetadataEntry, isComplex: boolean) => {
  const percent = Number(entry.percent * 100).toFixed(0)
  const ago = moment(entry.lastUpdated).fromNow()
  const complexity = isComplex ? 'of salt ' : ' '
  return `You have ${percent}% ${complexity}left as of ${ago}`
}

export const getSaltQueryText = async (isComplex: boolean = false) => {
  const results = (await dynamoClient.query({
    ExpressionAttributeValues: {':deviceId': deviceId},
    KeyConditionExpression: 'deviceId = :deviceId',
    TableName: 'salt-get-metadata',
  }).promise()).Items as MetadataEntry[] || []
  return results.length > 0 ? getSpeechText(results[0], isComplex) : deviceNotFoundText
}
