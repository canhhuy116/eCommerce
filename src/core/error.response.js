const StatusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

const ReasonPhrase = {
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  CONFLICT: 'Conflict',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  SERVICE_UNAVAILABLE: 'Service Unavailable',
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrase.BAD_REQUEST,
    status = StatusCode.BAD_REQUEST
  ) {
    super(message, status);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(
    message = ReasonPhrase.UNAUTHORIZED,
    status = StatusCode.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonPhrase.FORBIDDEN, status = StatusCode.FORBIDDEN) {
    super(message, status);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrase.NOT_FOUND, status = StatusCode.NOT_FOUND) {
    super(message, status);
  }
}

class ConflictError extends ErrorResponse {
  constructor(message = ReasonPhrase.CONFLICT, status = StatusCode.CONFLICT) {
    super(message, status);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonPhrase.INTERNAL_SERVER_ERROR,
    status = StatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message, status);
  }
}

class ServiceUnavailableError extends ErrorResponse {
  constructor(
    message = ReasonPhrase.SERVICE_UNAVAILABLE,
    status = StatusCode.SERVICE_UNAVAILABLE
  ) {
    super(message, status);
  }
}

module.exports = {
  StatusCode,
  ReasonPhrase,
  ErrorResponse,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ServiceUnavailableError,
};
