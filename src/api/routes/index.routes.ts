import cors from 'cors'
import exampleRouter from './example.route'
import express, { Router } from 'express'
import healthRouter from './health.routes'
import swaggerSetup from '../../docs/swagger'
import swaggerUi from 'swagger-ui-express'
import { errorHandlerMiddleware } from '../middlewares/error-handler.middleware'
import { getCheckJwtMiddleware } from '../middlewares/oauth.middleware'
import { GlobalConfiguration } from '../../interfaces/configurations.interfaces'
import { oauthErrorHandlerMiddleware } from '../middlewares/oauth-error-handling.middleware'
import { services } from '../../app'

export function createRouter(): express.Router {
  const router: Router = express.Router()
  const config: GlobalConfiguration = services.configService.getConfig()

  let origin: string[] | string = config.CORS_CONFIG.domainsWhiteList
  if (origin.length > 0 && origin[0] === '*') {
    origin = '*'
  }
  const corsConfiguration: {
    origin: string[] | string
    preflightContinue: boolean
  } = {
    preflightContinue: true,
    origin
  }
  router.use(cors(corsConfiguration))

  router.use('/health', healthRouter)
  router.use('/retrieve', exampleRouter)

  router.all('/', (_req: express.Request, res: express.Response) => {
    res.status(200).json({ mensaje: 'Welcome to Skrull!' })
  })

  router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup))

  if (config.AUTH_CONFIG.authType === 'OAUTH2.0') {
    router.use(getCheckJwtMiddleware())
    router.use(oauthErrorHandlerMiddleware)
  }

  router.use(errorHandlerMiddleware)
  return router
}
