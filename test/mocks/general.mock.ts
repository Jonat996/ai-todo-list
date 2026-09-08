import { Mock, vi } from "vitest"

/**
 * Spy function for info logging behavior.
 * Used to track calls to logger methods in tests.
 */
export const infoLoggerMock: Mock = vi.fn()

/**
 * Spy function for error logging behavior.
 */
export const errorLoggerMock: Mock = vi.fn()

/**
 * Mock for a logger module.
 * Simulates a logging service with `info` and `error` methods.
 */
export const mockLogger: () => {
    default: Mock<() => {
        info: Mock
        error: Mock
    }>
} = () => ({
  default: vi.fn(() => ({
    info: infoLoggerMock,
    error: errorLoggerMock
  }))
})

/**
 * Mock for uuid module's v4 function.
 * This mock is used to simulate UUID generation in tests.
 */
export const mockUuidv4: Mock = vi.fn()