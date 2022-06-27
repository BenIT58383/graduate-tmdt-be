import httpStatus from "http-status";

/**
 * @extends Error
 */
class ExtendableError extends Error {
	constructor(message, status, error, data) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.status = status;
		this.isPublic = false;
		this.isOperational = true;
		this.error = error;
		this.data = data;
		// Error.captureStackTrace(this, this.constructor.name)
	}
}
/**
 * Class representing an API error.
 * @extends ExtendableError
 */
export class APIError extends ExtendableError {
	/**
	 * Creates an API error.
	 * @param {string} message - Error message.
	 * @param {number} status - HTTP status code of error.
	 * @param {boolean} isPublic - Whether the message should be visible to user or not.
	 */
	constructor(
		message = "COMMON_ERR_001",
		status = httpStatus.INTERNAL_SERVER_ERROR,
		error = null
	) {
		super(message, status, error);
	}
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
export class APIErrorV2 extends ExtendableError {
	/**
	 * Creates an API error.
	 * @param {string} message - Error message.
	 * @param {number} status - HTTP status code of error.
	 * @param {Array} data - HTTP array data of error.
	 * @param {boolean} isPublic - Whether the message should be visible to user or not.
	 */
	constructor(
		message = "COMMON_ERR_001",
		status = httpStatus.INTERNAL_SERVER_ERROR,
		error = null,
		data
	) {
		super(message, status, error, data);
	}
}

export class InternalServerError extends APIError {
	constructor(error) {
		super("COMMON_ERR_001", httpStatus.INTERNAL_SERVER_ERROR, error);
	}
}

export class ForbiddenError extends APIError {
	constructor(message = "COMMON_ERROR_017") {
		super(message, httpStatus.FORBIDDEN);
	}
}

export class UnauthorizedError extends APIError {
	constructor(message = "COMMON_ERR_016") {
		super(message, httpStatus.UNAUTHORIZED);
	}
}
