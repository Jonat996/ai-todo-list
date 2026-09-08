import { ExampleInterface } from '../../interfaces/example.interfaces'
import { exampleRequestSchema } from '../../schemas/example.schemas'
import { NextFunction, Request, Response } from 'express'
import { ResponseHttpHandler } from '../../utils/http.responses.utils'
import { validateJSONSchema } from '@mercadoni/instaleap-utils'
import { ExampleController } from '../../controllers/example.controller'

/**
 * This is an example of how to build middleware
 * @param req Express request object
 * @param res Express response object
 */
export const exampleMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> | never => {
  const httpResponse = new ResponseHttpHandler(res)
  try {
    const validatedName = validateJSONSchema<ExampleInterface>(
      exampleRequestSchema,
      req.body
    )

    const exampleController = new ExampleController(
      '03ee45c2-6bc2-4cc8-ad0f-c571a741e142'
    )

    const userInfo = exampleController.retrieveUserData(validatedName.name)
    const message = 'The query has been successfully resolved'
    httpResponse.handleSuccess(message, userInfo)
  } catch (error) {
    next(error)
  }
}
