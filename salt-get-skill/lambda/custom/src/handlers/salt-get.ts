import { RequestHandler } from 'ask-sdk-core'
import { IntentRequest } from 'ask-sdk-model'
import { DynamoDB } from 'aws-sdk'
import moment from 'moment'
import {MetadataEntry} from '../../../../../salt-get-dynamo/dist/metadata-entry'
import { skillTitle } from '../common/literals'

const deviceNotFoundText = 'Ullgh, couldn\'t figure out where salt is need get'
const dynamoClient = new DynamoDB.DocumentClient()
const deviceId = process.env.DEVICE_ID
if (!deviceId) {
  throw new Error('device id not defined')
}

const getSpeechText = (entry: MetadataEntry) => {
  const percent = Number(entry.percent * 100).toFixed(0)
  const ago = moment(entry.lastUpdated).fromNow()
  return `You have ${percent}% of salt left as of ${ago}`
}

export const saltGetIntentHandler: RequestHandler = {
  canHandle: (handlerInput) => {
    const request = handlerInput.requestEnvelope.request as IntentRequest
    const canHandle =  request.type === 'IntentRequest' && request.intent.name === 'SaltGetIntent'
    return canHandle
  },
  handle: async (handlerInput) => {
    const results = (await dynamoClient.query({
      ExpressionAttributeValues: {':deviceId': deviceId},
      KeyConditionExpression: 'deviceId = :deviceId',
      TableName: 'salt-get-metadata',
    }).promise()).Items as MetadataEntry[] || []
    const speechText = results.length > 0 ? getSpeechText(results[0]) : deviceNotFoundText
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(skillTitle, speechText)
      .getResponse()
  },
}
