export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    if (details) {
      this.details = details
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

