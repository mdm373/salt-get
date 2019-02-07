import { RequestHandler } from 'ask-sdk-core'
import { IntentRequest } from 'ask-sdk-model'
import { skillTitle } from '../common/literals'
import { getNotificationUpdateText } from '../common/salt-request'

export const notificationSetHandler: RequestHandler = {
  canHandle: (handlerInput) => {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'NotificationSetIntent')
  },
  handle: async (handlerInput) => {
    const request = handlerInput.requestEnvelope.request as IntentRequest
    const threshold = request.intent.slots ? request.intent.slots.threshold : undefined
    const thresholdValue = threshold ? Number(threshold.value) : undefined
    const speechText = await getNotificationUpdateText(thresholdValue)
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(skillTitle, speechText)
      .getResponse()
  },
}
