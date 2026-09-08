/**
 * Mock for the error details.
 */
export const mockDetails = {
  query: 'SELECT * FROM users WHERE id = $1',
  params: ['abc03b8a-410d-4287-b333-d3c1ee2e1b97']
}

/**
 * Mock for the user details.
 */
export const mockUserDetails: {
    userId: string;
    reason: string;
} = {
  userId: 'abc03b8a-410d-4287-b333-d3c1ee2e1b97',
  reason: 'User does not exist in the database.'
}

/**
 * Mock for the error message.
 */
export const mockMessage: string =
  "User with id 'abc03b8a-410d-4287-b333-d3c1ee2e1b97' was not found"
