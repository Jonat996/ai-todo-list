import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router
} from 'express'
import { exampleMiddleware } from '../middlewares/example.middleware'

const router = Router()

/**
 * @swagger
 * paths:
 *  /retrieve/example:
 *    get:
 *      tags:
 *        - User
 *      summary: Consult the users
 *      description: This example endpoint queries users
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#components/schemas/ExampleSchema"
 *      responses:
 *        200:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: The query has been successfully resolved
 *                  operationPayload:
 *                    type: object
 *                    example:
 *                      firstName: John
 *                      lastName: Doe
 *                      phone: 123456789
 *        403:
 *          description: Forbidden
 *          content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: An error occurred during authentication, please check the details.
 *                   errorCode:
 *                    type: number
 *                    example: 27
 *                   errorDetails:
 *                     type: string
 *                     example: {}
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: An internal error has occurred.
 *                  errorCode:
 *                    type: number
 *                    example: 129
 */
router.post('/example', (async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await exampleMiddleware(req, res, next)
}) as RequestHandler)

export default router
