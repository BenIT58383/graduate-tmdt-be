import httpStatus from 'http-status'
import service from './services'
import { APISuccess } from '../../common/helpers/api-response'
import {
  UnauthorizedError,
  InternalServerError,
  APIError,
  ForbiddenError,
} from '../../common/helpers/api-error'
import { MESSAGE_THROW_ERROR } from '../../common/constant/index'
import CommonHelper from '../../common/utils/common'
import config from '../../common/config'
import checkAuth from '../../express/middleware/authority-check'

const register = async (req, res, next) => {
  const { phone, password } = req.body
  service
    .register(phone, password)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const login = async (req, res, next) => {
  const { phone, password } = req.body
  service
    .login(phone, password)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const createNewToken = async (req, res, next) => {
  const refreshTokenAuth = req.body
  service
    .createNewToken(refreshTokenAuth)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const createUser = async (req, res, next) => {
  const {
    code,
    phone,
    password,
    fsIdCard,
    bsIdCard,
    avatar,
    fullName,
    birthDay,
    idCardNo,
    job,
    address,
    salary,
    education,
    marriage,
    bankNo,
    bankName,
    cardHolder,
  } = req.body
  const refreshToken = jwtHelper.jwtEncode({}, config.ACCESS_TOKEN_SECRET)
  service
    .createUser(
      code,
      phone,
      password,
      fsIdCard,
      bsIdCard,
      avatar,
      fullName,
      birthDay,
      idCardNo,
      job,
      address,
      salary,
      education,
      marriage,
      bankNo,
      bankName,
      cardHolder,
      refreshToken
    )
    .then((data) => {
      const dataForAccessToken = {
        userId: data.user.id,
        email: data.user.email,
        phone: data.user.phone,
        type: data.user.type,
        refreshToken: refreshToken,
      }
      const token = jwtHelper.jwtEncode(
        { data: dataForAccessToken },
        config.ACCESS_TOKEN_SECRET
      )

      const dataForUser = {
        userId: data.user.userId,
        fullName: data.user.fullName,
        gender: data.user.gender,
        avatar: data.user.url,
        birthday: data.user.birthday,
      }

      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const updateUser = async (req, res, next) => {
  const { phone } = req.params
  const {
    code,
    password,
    type,
    fsIdCard,
    bsIdCard,
    avatar,
    fullName,
    birthDay,
    idCardNo,
    job,
    address,
    salary,
    education,
    marriage,
    bankNo,
    bankName,
    cardHolder,
  } = req.body
  service
    .updateUser(
      phone,
      code,
      password,
      type,
      fsIdCard,
      bsIdCard,
      avatar,
      fullName,
      birthDay,
      idCardNo,
      job,
      address,
      salary,
      education,
      marriage,
      bankNo,
      bankName,
      cardHolder
    )
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const getDetailUser = async (req, res, next) => {
  const { id } = req.params
  service
    .getDetailUser(id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const getListUsers = async (req, res, next) => {
  const { page, size, code, name, phone } = req.query
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .getListUsers(page, size, code, name, phone, user)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const deleteUser = async (req, res, next) => {
  const { id } = req.params
  service
    .deleteUser(id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

export default {
  register,
  login,
  createNewToken,
  createUser,
  updateUser,
  getDetailUser,
  getListUsers,
  deleteUser,
}
