import { DynamoDB } from 'aws-sdk'
import {HistoryEntry} from '../../salt-get-dynamo/dist/history-entry'
import {MetadataEntry} from '../../salt-get-dynamo/dist/metadata-entry'
const dynamoClient = new DynamoDB.DocumentClient()

export const handler = async (request: HistoryEntry) => {
  if (request.distanceMax <= request.distanceMin) {
    throw new Error('invalid bounds in reading')
  }
  if (request.distanceCurrent > request.distanceMax || request.distanceCurrent < request.distanceMin ) {
    throw new Error('invalid current in reading')
  }
  if (request.distanceMax < 0 || request.distanceCurrent < 0 || request.distanceMin < 0) {
    throw new Error('invalid sign in reading')
  }
  const actualTime = new Date()
  const actualTimestamp = actualTime.toISOString()
  const actualPercent = (request.distanceCurrent - request.distanceMin) / (request.distanceMax - request.distanceMin)
  const newMetadata: MetadataEntry = {
    deviceId: request.deviceId,
    lastUpdated: actualTimestamp,
    percent: actualPercent,
  }
  const newHistory: HistoryEntry = {
    deviceId: request.deviceId,
    distanceCurrent: request.distanceCurrent,
    distanceMax: request.distanceMax,
    distanceMin: request.distanceMin,
    percent: actualPercent,
    timestamp: actualTimestamp,
  }
  await Promise.all([
    dynamoClient.put({ TableName: 'salt-get-metadata', Item: newMetadata }).promise(),
    dynamoClient.put({ TableName: 'salt-get-history', Item: newHistory }).promise(),
  ])
  return {status: 'ok'}
}
