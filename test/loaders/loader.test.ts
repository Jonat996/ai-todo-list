import { describe, test, expect } from 'vitest'
import { Loader } from '../../src/loaders/loader'

class ConcreteLoader extends Loader {
  load(): string {
    return 'loaded'
  }
}

describe('Test for the Loader abstract class', () => {
  test('should not be directly instantiable', () => {
    expect(typeof Loader).toBe('function')
  })

  test('should be extendable by a concrete class', () => {
    const loaderInstance: ConcreteLoader = new ConcreteLoader()
    expect(loaderInstance).toBeInstanceOf(Loader)
    expect(loaderInstance).toBeInstanceOf(ConcreteLoader)
  })

  test('should have an abstract load method that must be implemented', () => {
    const loaderInstance: ConcreteLoader = new ConcreteLoader()
    expect(typeof loaderInstance.load).toBe('function')
  })

  test('should allow the implemented load method to be called', () => {
    const loaderInstance: ConcreteLoader = new ConcreteLoader()
    const result: string = loaderInstance.load()
    expect(result).toBe('loaded')
  })
})
