import { DynamoDB, SNS } from 'aws-sdk'
import {HistoryEntry} from '../../salt-get-dynamo/dist/history-entry'
import {MetadataEntry} from '../../salt-get-dynamo/dist/metadata-entry'

const dynamoClient = new DynamoDB.DocumentClient()
const sns = new SNS()

const getExistingMetadata = async (deviceId: string) => {
  const items = (await dynamoClient.query({
    TableName: 'salt-get-metadata',
    KeyConditionExpression: 'deviceId = :deviceId',
    ExpressionAttributeValues: {':deviceId': deviceId},
  }).promise()).Items
  return items && items[0] as MetadataEntry || undefined
}

export const handler = async (request: HistoryEntry) => {
  if (request.distanceMax <= request.distanceMin) {
    throw new Error('invalid bounds')
  }
  if (request.distanceCurrent > request.distanceMax || request.distanceCurrent < request.distanceMin ) {
    throw new Error('out of bounds')
  }
  if (request.distanceMax < 0 || request.distanceCurrent < 0 || request.distanceMin < 0) {
    throw new Error('negitive bounds')
  }
  const actualTime = new Date()
  const actualTimestamp = actualTime.toISOString()
  const actualPercent =  1.0 - (request.distanceCurrent - request.distanceMin) / (request.distanceMax - request.distanceMin)
  const trunkatedPercent = Number(actualPercent.toFixed(3))
  const existing = await getExistingMetadata(request.deviceId)
  const wasNotified = existing && existing.wasNotified || false
  const phoneNumber = process.env.PHONE_NUMBER
  const shouldNotify = (existing && existing.thresholdPercent || 0) >= actualPercent && !wasNotified && phoneNumber !== undefined
  const newMetadata: MetadataEntry = {
    deviceId: request.deviceId,
    lastUpdated: actualTimestamp,
    percent: trunkatedPercent,
    thresholdPercent : existing && existing.thresholdPercent || 0,
    wasNotified: shouldNotify || wasNotified,
  }
  const newHistory: HistoryEntry = {
    deviceId: request.deviceId,
    distanceCurrent: request.distanceCurrent,
    distanceMax: request.distanceMax,
    distanceMin: request.distanceMin,
    percent: trunkatedPercent,
    timestamp: actualTimestamp,
  }
  await Promise.all([
    dynamoClient.put({ TableName: 'salt-get-metadata', Item: newMetadata }).promise(),
    dynamoClient.put({ TableName: 'salt-get-history', Item: newHistory }).promise(),
  ])
  if (shouldNotify) {
    await sns.publish({
      PhoneNumber: `+1 ${phoneNumber}`,
      Message: `Time to fill back up on salt. You're down to ${trunkatedPercent * 100}%`,
    }).promise()
  }
  return {status: 'ok'}
}
