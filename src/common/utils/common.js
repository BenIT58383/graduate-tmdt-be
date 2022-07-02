import jwtHelper from '../../common/helpers/jwt-helper'

const getUserFromRequest = async (req) => {
  // Get x-auth-token in header
  let user = ''
  var token = req.header('Authorization')

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.substring(7, token.length)
    }
    const decodeUser = jwtHelper.jwtDecode(token)
    user = decodeUser.payload
  }
  return user
}

export default {
  getUserFromRequest,
}
