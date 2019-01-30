import { RequestHandler } from 'ask-sdk-core'
import { DynamoDB } from 'aws-sdk'
import {MetadataEntry} from '../../../../../salt-get-dynamo/dist/metadata-entry'
import { skillTitle } from '../common/literals'

const dynamoClient = new DynamoDB.DocumentClient()
const deviceId = process.env.DEVICE_ID
if (!deviceId) {
  throw new Error('device id not defined')
}

const getSpeechText = (entry: MetadataEntry) => {
  const percent = Number(entry.percent * 100).toFixed(2)
  return `You have ${percent}% of salt left`
}

export const saltGetIntentHandler: RequestHandler = {
  canHandle: (handlerInput) => {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'SaltGetIntent'
  },
  handle: async (handlerInput) => {
    const results = (await dynamoClient.query({
      ExpressionAttributeValues: {':deviceId': deviceId},
      KeyConditionExpression: 'deviceId = :deviceId',
      TableName: 'salt-get-metadata',
    }).promise()).Items || []
    const speechText = results.length > 0 ?
      getSpeechText(results[0] as MetadataEntry) :
      'Ullgh, couldn\'t figure out where salt is need get'
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(skillTitle, speechText)
      .getResponse()
  },
}
