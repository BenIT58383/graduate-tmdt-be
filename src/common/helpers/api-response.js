import httpStatus from "http-status";
/**
 * Class success response object
 */
export class APISuccess {
	constructor(res, data = {}, statusCode = httpStatus.OK) {
		data.message = "COMMON_MSG_001";
		if (Object.entries(data).length === 0 && data.constructor === Object) {
			res.status(httpStatus.NO_CONTENT).json();
		} else {
			res.status(statusCode).json(data);
		}
	}
}

export class APISuccessNoContent extends APISuccess {
	constructor(res) {
		super(res);
	}
}
