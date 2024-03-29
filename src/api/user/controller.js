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
  const { userName, phone, email, password } = req.body
  service
    .register(userName, phone, email, password)
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
  const { userNamePhone, email, password } = req.body
  service
    .login(userNamePhone, email, password)
    .then((data) => {
      return new APISuccess(res, {
        data: data
      })
    })
    .catch((err) => {
      next(err)
    })
}

const createUser = async (req, res, next) => {
  const { userName, phone, email, password, role, name, image1, image2, image3, dateOfBirth } = req.body
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .createUser(userName, phone, email, password, role, name, image1, image2, image3, dateOfBirth, user.id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const updateUser = async (req, res, next) => {
  const { id } = req.params
  const { userName, phone, email, role, name, image1, image2, image3, dateOfBirth, status, isOnline, password } = req.body
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .updateUser(id, userName, phone, email, role, name, image1, image2, image3, dateOfBirth, status, isOnline, user.id, password)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const updatePasswordUser = async (req, res, next) => {
  const { id, password } = req.body
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .updatePasswordUser(id, password, user.id)
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
  const { page, size, search, status, startDate, endDate } = req.query
  service
    .getListUsers(page, size, search, status, startDate, endDate)
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

const createAddress = async (req, res, next) => {
  const { storeId, customerName, phone, location, isDefault, type } = req.body
  const user = await CommonHelper.getUserFromRequest(req)

  service
    .createAddress(
      storeId,
      customerName,
      phone,
      location,
      isDefault,
      type,
      user.id
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

const getDetailAddress = async (req, res, next) => {
  const { id } = req.params
  service
    .getDetailAddress(id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const getListAddress = async (req, res, next) => {
  const { page, size, userId, storeId, isDefault, type } = req.query
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .getListAddress(page, size, userId, storeId, isDefault, type)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const updateAddress = async (req, res, next) => {
  const { id } = req.params
  const { storeId, customerName, phone, location, isDefault, type } = req.body
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .updateAddress(
      id,
      storeId,
      customerName,
      phone,
      location,
      isDefault,
      type,
      user.id
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

const deleteAddress = async (req, res, next) => {
  const { id } = req.params
  service
    .deleteAddress(id)
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
  createUser,
  updateUser,
  updatePasswordUser,
  getDetailUser,
  getListUsers,
  deleteUser,
  createAddress,
  getDetailAddress,
  getListAddress,
  updateAddress,
  deleteAddress,
}
