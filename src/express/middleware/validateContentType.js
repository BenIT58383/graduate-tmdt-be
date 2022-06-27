import httpStatus from 'http-status'

/**
 * Validate content type
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const validateContentType = (req, res, next) => {
  let check = true
  const path = req.originalUrl
  const objParam = req.params
  const objBody = req.body
  if (req.method === 'PUT') {
    if (
      !req.is('application/json') &&
      (Object.keys(objParam).length === 0 || Object.keys(objBody).length === 0)
    ) {
      check = false
    }
  }

  if (req.method === 'DELETE') {
    if (!req.is('application/json') && Object.keys(objParam).length === 0) {
      check = false
    }
  }

  if (req.method === 'POST') {
    if (
      path.indexOf('/report/plan') == 0 ||
      path.indexOf('/report/category/excel') == 0 ||
      path.indexOf('/report/yield/month/import') == 0 ||
      path.indexOf('/report/yield/day/import') == 0
    ) {
      const contentType = req.headers['content-type']
      if (!contentType) {
        check = false
      } else {
        if (contentType.indexOf('multipart/form-data') === -1) {
          check = false
        }
      }
    } else {
      if (!req.is('application/json')) {
        check = false
      }
    }
  }
  if (!check) {
    res.status(httpStatus.UNSUPPORTED_MEDIA_TYPE).json({
      error: {
        message: 'COMMON_ERR_020',
        errors: {
          message: ['Unsupported Media Type.'],
        },
      },
    })
  } else {
    next()
  }
}

export default validateContentType
