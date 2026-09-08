/**
 * This is a set of connection failures that are consideres as critical.
 * If any of these codes are found in the error message, the database connection will be considered as failed.
 * This will trigger the alarms system.
 */
export const connectionFailuresSet: Set<string> = new Set([
  '08000', // Connection error
  '08001', // SQL client unable to establish connection
  '08004', // Server rejected the connection
  '08003', // Connection does not exist
  '08006', // Connection failure
  '28000', // Invalid authorization specification
  '28P01', // Invalid authentication (wrong credentials)
  '3D000', // Database does not exist
  '57P01', // Database shutting down
  '57P02', // Cannot access the database
  '57P03', // Cannot connect right now
  '53300', // Too many connections
  'HV00N', // FDW unable to establish connection
  'ECONNREFUSED', // Connection refused (server not reachable)
  'ECONNRESET', // Connection reset by peer
  'EHOSTUNREACH', // No route to host
  'ENOTFOUND', // Host not found
  'EPIPE', // Broken pipe (connection lost)
  'PROTOCOL_CONNECTION_LOST' // server closed the connection unexpectedly
])
