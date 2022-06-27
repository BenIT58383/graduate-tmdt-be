import { ValidationError } from 'express-validation'
import multer from 'multer'
import httpStatus from 'http-status'
import { APIError } from '../../common/helpers/api-error'

// Check environment
// const dev = config.NODE_ENV !== 'production'
const dev = true

/**
 * Handler error middleware
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const expressErrorHandler = (err, req, res, next) => {
  // Check error type
  console.log(err)
  if (err instanceof ValidationError) {
    return res.status(err.status).json(err)
  } else if (
    err.status === httpStatus.BAD_REQUEST &&
    err.message.messages === 'COMMON_VALIDATE_TIMESTAMP'
  ) {
    // 400 - Bad request
    res.status(err.status).json({
      error: {
        message: 'COMMON_ERR_002',
        errors: err.message.errors,
      },
    })
  } else if (
    err.status === httpStatus.NOT_FOUND &&
    err.message === 'COMMON_ERR_010'
  ) {
    res.status(err.status).json({
      error: {
        message: 'COMMON_ERR_010',
        errors: dev
          ? err.stack
          : [
              {
                messages: ['There is no data that can be registered.'],
              },
            ],
      },
    })
  } else if (
    //Multer upload error
    err instanceof multer.MulterError ||
    err.name === 'FILE_NOT_FOUND'
  ) {
    if (err.name === 'FILE_NOT_FOUND') {
      res.status(httpStatus.NOT_FOUND).json({
        error: {
          message: 'COMMON_ERR_005',
          errors: dev
            ? err.stack
            : [
                {
                  messages: ['File not foud.'],
                },
              ],
        },
      })
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      res.status(httpStatus.BAD_REQUEST).json({
        error: {
          message: 'COMMON_ERR_026',
          errors: dev
            ? err.stack
            : [
                {
                  messages: ['Limit file count.'],
                },
              ],
        },
      })
    } else if (err.code === 'UPLOAD_WRONG_TYPE') {
      res.status(httpStatus.BAD_REQUEST).json({
        error: {
          message: 'COMMON_ERR_009',
          errors: dev
            ? err.stack
            : [
                {
                  messages: ['Upload wrong type.'],
                },
              ],
        },
      })
    } else if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(httpStatus.REQUEST_ENTITY_TOO_LARGE).json({
        error: {
          message: 'COMMON_ERR_006',
          errors: dev
            ? err.stack
            : [
                {
                  messages: ['Upload file too large.'],
                },
              ],
        },
      })
    } else {
      console.log(res)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        errors: {
          message: 'COMMON_ERR_001',
          data: dev
            ? err
            : [{ messages: ['The request failed due to an internal error.'] }],
        },
      })
    }
  } else if (err.status === httpStatus.FORBIDDEN) {
    res.status(err.status).json({
      error: {
        message: err.message ? err.message : 'COMMON_ERROR_017',
        errors: dev
          ? err.stack
          : [
              {
                messages: [
                  'The requested operation is forbidden and cannot be completed.',
                ],
              },
            ],
      },
    })
  } else if (err.status === httpStatus.UNAUTHORIZED) {
    res.status(err.status).json({
      error: {
        message: err.message ? err.message : 'COMMON_ERR_016',
        errors: dev
          ? err.stack
          : [
              {
                messages: ['The user is not authorized to make the request.'],
              },
            ],
      },
    })
  } else if (err.status === httpStatus.CONFLICT) {
    res.status(err.status).json({
      error: {
        message: err.message ? err.message : 'COMMON_ERR_409',
        errors: dev
          ? err.stack
          : [
              {
                messages: ['The user is not authorized to make the request.'],
              },
            ],
        data: err.data,
      },
    })
  } else if (err instanceof APIError) {
    var errors = []
    console.log(err)
    if (err.message === 'COMMON_ERR_010') {
      errors = [{ messages: ['Please input end user.'] }]
    } else if (err.message === 'COMMON_ERR_004') {
      errors = [{ messages: ['Duplicated key'] }]
    } else if (err.message === 'COMMON_ERR_025') {
      errors = [{ messages: ['Not exist.'] }]
    } else if (err.message === 'COMMON_ERR_024') {
      errors = [{ messages: ['Already registered.'] }]
    } else if (err.message === 'COMMON_ERR_007') {
      errors = [{ messages: ['Content empty.'] }]
    } else if (err.message === 'COMMON_ERR_005') {
      errors = [{ messages: ['File not foud.'] }]
    } else if (err.message === 'COMMON_ERR_002') {
      errors = [{ messages: ['Wrong format.'] }]
    } else {
      if (Array.isArray(err.error)) {
        errors = err.error.map((e, i) => {
          return { messages: [e.message] }
        })
      } else if (err.error instanceof Error) {
        errors = [err.error.message]
      }
    }
    console.log(err)
    if (err.status === httpStatus.INTERNAL_SERVER_ERROR) {
      console.log(err)
      errors = dev
        ? [{ message: err.error.stack }]
        : [{ messages: ['The request failed due to an internal error.'] }]
    }
    res.status(err.status).json({
      error: {
        message: err.message ? err.message : 'COMMON_ERR_001',
        errors,
      },
    })
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        message: 'COMMON_ERR_001',
        errors: dev
          ? err.stack
          : [{ messages: ['The request failed due to an internal error.'] }],
      },
    })
  }
}

export default expressErrorHandler
