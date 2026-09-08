import { createSingleton } from '@mercadoni/instaleap-utils'
export class ExampleServices extends createSingleton<ExampleServices>() {
  private readonly users = [
    { firstName: 'John', lastName: 'Doe', phone: '123456789' },
    { firstName: 'Jane', lastName: 'Smith', phone: '987654321' }
  ]

  /**
   * This method retrieves user information by name
   * @param name Name that needs to be retrieved. I.e,'Jhon'
   * @returns The user information. I.e, {
   *    "firstName": "Jhon",
   *    "lastName": "Doe"
   *    "phone": "123456789"
   * }
   */
  getUserInfoByName(name: string): {
    firstName: string
    lastName: string
    phone: string
  } {
    try {
      const user = this.users.find(
        (user) => user.firstName.toLowerCase() === name.toLowerCase()
      )
      if (!user) {
        throw new Error(`No user found with the name: ${name}`)
      }
      return user
    } catch (error) {
      throw new Error(error)
    }
  }
}
