const StatusCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  PARTIAL_CONTENT: 206,
  MULTI_STATUS: 207,
  ALREADY_REPORTED: 208,
  IM_USED: 226,
};

const ReasonPhrase = {
  OK: 'OK',
  CREATED: 'Created',
  ACCEPTED: 'Accepted',
  NO_CONTENT: 'No Content',
  PARTIAL_CONTENT: 'Partial Content',
  MULTI_STATUS: 'Multi-Status',
  ALREADY_REPORTED: 'Already Reported',
  IM_USED: 'IM Used',
};

class SuccessResponse {
  constructor(
    message,
    statusCode = StatusCode.OK,
    reasonPhrase = ReasonPhrase.OK,
    metadata = {}
  ) {
    this.message = !message ? reasonPhrase : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).set(headers).json(this);
  }
}

class OK extends SuccessResponse {
  constructor(message, metadata) {
    super(message, metadata);
  }
}

class Created extends SuccessResponse {
  constructor({
    options = {},
    message,
    statusCode = StatusCode.CREATED,
    reasonPhrase = ReasonPhrase.CREATED,
    metadata,
  }) {
    super(message, statusCode, reasonPhrase, metadata);
    this.options = options;
  }
}

module.exports = { SuccessResponse, OK, Created };
