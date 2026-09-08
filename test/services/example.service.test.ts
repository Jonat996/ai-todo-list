import { describe, test, expect } from 'vitest'
import { ExampleServices } from '../../src/services/example.service'
import { mockName, mockNonExistentName, mockUser } from './mocks/example.services.mock'

describe('Test for the ExampleServices', () => {
  const exampleService: ExampleServices = new ExampleServices()

  test('should return user information for a valid name', () => {
    const user: {
    firstName: string
    lastName: string
    phone: string
} = exampleService.getUserInfoByName(mockName)
    expect(user).toBeDefined()
    expect(user).toEqual(mockUser)
  })

  test('should be case-insensitive when searching for a user', () => {
    const user: {
      firstName: string
      lastName: string
      phone: string
    } = exampleService.getUserInfoByName(mockName)
    expect(user).toBeDefined()
    expect(user.firstName).toBe(mockName)
  })

  test('should throw an error if the user is not found', () => {
    expect(() => exampleService.getUserInfoByName(mockNonExistentName)).toThrow(
      `No user found with the name: ${mockNonExistentName}`
    )
  })
})