import { AppError } from '../utils/appError.js'

export function notFoundHandler(req, res, next) {
  const message = `Route ${req.originalUrl} not found`
  next(new AppError(message, 404, 'NOT_FOUND'))
}

export function errorHandler(err, req, res, next) {
  // Fallbacks
  let statusCode = err.statusCode || 500
  let code = err.code || 'INTERNAL_ERROR'
  let message = err.message || 'Something went wrong'

  // Validation errors (e.g. from Mongoose or manual validation)
  if (err.name === 'ValidationError') {
    statusCode = 400
    code = 'VALIDATION_ERROR'
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    code = 'INVALID_TOKEN'
    message = 'Invalid authentication token'
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401
    code = 'TOKEN_EXPIRED'
    message = 'Authentication token has expired'
  }

  // MongoDB errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    if (err.code === 11000) {
      statusCode = 409
      code = 'DUPLICATE_KEY'
      message = 'Duplicate key error'
    } else if (statusCode === 500) {
      statusCode = 500
      code = 'DB_ERROR'
      message = 'Database error'
    }
  }

  // MySQL duplicate entry (current project)
  if (err.code === 'ER_DUP_ENTRY' && statusCode === 500) {
    statusCode = 409
    code = 'DUPLICATE_KEY'
    message = 'Duplicate entry'
  }

  const response = {
    success: false,
    error: {
      code,
      message,
    },
  }

  if (err.details) {
    response.error.details = err.details
  }

  // Standard shape for validation details (e.g. Mongoose)
  if (err.errors && typeof err.errors === 'object' && !Array.isArray(err.errors)) {
    response.error.validation = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message || String(err.errors[key]),
    }))
  }

  if (process.env.NODE_ENV !== 'production') {
    response.error.stack = err.stack
  }

  // eslint-disable-next-line no-console
  if (statusCode >= 500) {
    console.error(err)
  }

  res.status(statusCode).json(response)
}

