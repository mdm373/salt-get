import { SkillBuilders} from 'ask-sdk-core'
import { cancelAndStopIntentHandler } from './handlers/cancel-and-stop'
import { errorHandler } from './handlers/error'
import { helpIntentHandler } from './handlers/help'
import { launchRequestHandler } from './handlers/launch'
import { notificationSetHandler } from './handlers/notification-set'
import { saltGetIntentHandler } from './handlers/salt-get'
import { sessionEndedRequestHandler } from './handlers/session-end'

export const  handler = SkillBuilders.custom()
  .addRequestHandlers(
    launchRequestHandler,
    saltGetIntentHandler,
    helpIntentHandler,
    cancelAndStopIntentHandler,
    sessionEndedRequestHandler,
    notificationSetHandler,
  )
  .addErrorHandlers(errorHandler)
  .lambda()
