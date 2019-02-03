import { RequestHandler } from 'ask-sdk-core'
import { IntentRequest } from 'ask-sdk-model'
import { skillTitle } from '../common/literals'
import { getSaltQueryText } from '../common/salt-request'

export const saltGetIntentHandler: RequestHandler = {
  canHandle: (handlerInput) => {
    const request = handlerInput.requestEnvelope.request as IntentRequest
    const canHandle =  request.type === 'IntentRequest' && request.intent.name === 'SaltGetIntent'
    return canHandle
  },
  handle: async (handlerInput) => {
    const text = await getSaltQueryText()
    return handlerInput.responseBuilder
      .speak(text)
      .withSimpleCard(skillTitle, text)
      .getResponse()
  },
}
