import jwt from 'jsonwebtoken'
// import service from '../../api/account/services'
import logger from '../../common/utils/logger'
/**
 * Decode JWT
 * @param {string} token
 */
const jwtDecode = (token) =>
  jwt.decode(token, {
    complete: true,
  })

/**
 * Encode JWT
 * @param {string} payload
 * @param {string} secret
 */
const jwtEncode = (payload, secret) => jwt.sign(payload, secret)

/**
 * Verify token
 * @param {string} token
 */
const verifyToken = (token, secretKey) => {
  logger.info('token: ' + token)
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, { algorithms: ['HS256'] }, (err, decoded) => {
      if (err) {
        logger.error('verifyTokenErr: ' + err)
        reject(err)
      } else {
        logger.info('userInfo: ' + JSON.stringify(decoded))
        resolve(decoded)
      }
    })
  })
}

// const verifyRefreshToken = async (authorization) => {
//   const userId = authorization.user.userId
//   const refreshToken = await service.getRefreshToken(userId)
//   if (refreshToken && refreshToken === authorization.user.refreshToken) {
//     return true
//   }
//   return false
// }

const generateToken = async (payload, secretSignature, tokenLife) => {
  return jwt.sign(payload, secretSignature, {
    algorithms: ['HS256'],
  })
}

export default {
  jwtDecode,
  jwtEncode,
  verifyToken,
  generateToken,
  // verifyRefreshToken,
}
