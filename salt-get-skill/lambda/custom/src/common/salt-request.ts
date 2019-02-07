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

const getNotificationTextForEntry = async (entry: MetadataEntry, threshold?: number) => {
  const updatedThreshold = threshold ? threshold : entry.thresholdPercent * 100
  const updated = {...entry, ...{wasNotified: false, thresholdPercent: updatedThreshold / 100 } }
  const percent = updatedThreshold.toFixed(0)
  await dynamoClient.put({
    Item: updated,
    TableName: 'salt-get-metadata',
  }).promise()
  return `Sure thing. I\'ll let you know when you're down to ${percent}% of salt left`
}

export const getNotificationUpdateText = async (threshold?: number) => {
  const results = (await dynamoClient.query({
    ExpressionAttributeValues: {':deviceId': deviceId},
    KeyConditionExpression: 'deviceId = :deviceId',
    TableName: 'salt-get-metadata',
  }).promise()).Items as MetadataEntry[] || []
  return results.length > 0 ? (await getNotificationTextForEntry(results[0], threshold)) : deviceNotFoundText
}
