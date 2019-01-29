import { RequestHandler } from 'ask-sdk-core'
import { skillTitle } from '../common/literals'

export const saltGetIntentHandler: RequestHandler = {
  canHandle: (handlerInput) => {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'SaltGetIntent'
  },
  handle: (handlerInput) => {
    const speechText = 'Hello World!'

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(skillTitle, speechText)
      .getResponse()
  },
}
