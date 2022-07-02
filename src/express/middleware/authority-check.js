import { rejects } from 'assert'
import NodeCache from 'node-cache'
import { resolve } from 'path'
import config from '../../common/config'
import jwtHelper from '../../common/helpers/jwt-helper'
import logger from '../../common/utils/logger'

const cacheService = new NodeCache({ stdTTL: 100, checkperiod: 120 })

const AUTHORITY_CHECK = {
  CLIENT: ['/user-groups', 'entities', 'statistics'],
}

/**
 * Check user authentication & user authorization
  @param {} req
  @param {} res
  @param {} next
 */
const authorityCheck = (req, res, next) => {
  // Remove last slash
  const path = req.path.endsWith('/') ? req.path.slice(0, -1) : req.path
  const method =
    req.method === 'GET' ||
    req.method === 'DELETE' ||
    req.method === 'PUT' ||
    req.method === 'POST'

  const ip = req.ip.slice(2)
  console.log(`-------------------Client IP-----------------------`)
  console.log(req.ip)
  console.log(`---------------------------------------------------`)
  // Get x-auth-token in header
  var token = req.header('Authorization')
  if (token && token.startsWith('Bearer ')) {
    token = token.substring(7, token.length)
  }
  // Check authentization
  if (path == '/login' || path == '/register') {
    return next()
  }

  checkAuthorization(method, token, path)
    .then((authorization) => {
      if (authorization.unauthorized) {
        // 401 - Unauthorized
        res.status(401).json({
          error: {
            message: 'COMMON_ERR_016',
            errors: [
              {
                messages: ['The user is not authorized to make the request.'],
              },
            ],
          },
        })
      } else if (authorization.forbidden) {
        // 403 - Forbidden
        res.status(403).json({
          error: {
            message: 'COMMON_ERR_017',
            errors: [
              {
                message: [
                  'The requested operation is forbidden and cannot be completed.',
                ],
              },
            ],
          },
        })
      } else {
        // Authorized
        logger.error(
          'Login successfully: ' + JSON.stringify(authorization.user)
        )
        req.user = authorization.user
        req.session = authorization.session
        next()
      }
    })
    .catch((err) => {
      next(err)
    })
}

// eslint-disable-next-line prettier/prettier
const checkAuthorization = function (method, accessToken, path) {
  return new Promise((resolve, reject) => {
    let authorization = {
      unauthorized: true,
      forbidden: false,
      user: {},
      message: {},
    }

    if (accessToken) {
      const cacheKey = `accessToken:${accessToken}`
      if (cacheService.has(cacheKey)) {
        authorization = cacheService.get(cacheKey)
        authorization.unauthorized = false
        cacheService.set(`accessToken:${accessToken}`, authorization, 10 * 60)
        resolve(authorization)
      } else {
        const accessTokenSecret = config.ACCESS_TOKEN_SECRET
        jwtHelper
          .verifyToken(accessToken, accessTokenSecret)
          .then(async (response) => {
            authorization.unauthorized = false
            const user = response.data
            authorization.user = user
            cacheService.set(
              `accessToken:${accessToken}`,
              authorization,
              10 * 60
            )
            resolve(authorization)
          })
          .catch((err) => {
            authorization.unauthorized = false
            authorization.message = err
            cacheService.set(
              `accessToken:${accessToken}`,
              authorization,
              10 * 60
            )
            reject(authorization)
          })
      }
    } else {
      authorization.unauthorized = true
      cacheService.set(`accessToken:${accessToken}`, authorization, 10 * 60)
      resolve(authorization)
    }
  })
}
const checkWhiteList = (res, ip, whiteList) => {
  if (!whiteList.includes(ip)) {
    res.status(403).json({
      error: {
        message: 'COMMON_ERR_017',
        errors: [
          {
            message: [
              'The requested operation is forbidden and cannot be completed.',
            ],
          },
        ],
      },
    })
    return false
  }
  return true
}
export default authorityCheck
