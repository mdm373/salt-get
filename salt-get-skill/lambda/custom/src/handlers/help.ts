import { RequestHandler } from 'ask-sdk-core'
import { skillTitle } from '../common/literals'

export const helpIntentHandler: RequestHandler = {
  canHandle: (handlerInput) => {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
  },
  handle: (handlerInput) => {
    const speechText = 'You can ask is salt is need get.'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(skillTitle, speechText)
      .getResponse()
  },
}
