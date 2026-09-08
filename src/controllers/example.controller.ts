import { services } from '../app'
import { BaseController } from './base.controller'

export class ExampleController extends BaseController {
  /**
   * This is an example controller for a request
   * @param processId processId of a request if it has one. I.e, 'as541va6-1a6d5-6as5ed-b46hsdf'
   */
  constructor(processId: string) {
    super(processId)
  }

  /**
   * This method retrieves user information by their name.
   * @param name Name that needs to be retrieved. I.e,'Jhon'
   */
  public retrieveUserData(name: string): {
    firstName: string
    lastName: string
    phone: string
  } {
    try {
      const user = services.exampleService.getUserInfoByName(name)
      return user
    } catch (error) {
      throw new Error(error)
    }
  }
}
