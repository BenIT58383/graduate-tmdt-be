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

const createOrder = async (req, res, next) => {
  const { userId, products, addressId, note } = req.body
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .createOrder(userId, products, addressId, note, user.id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const createOrderV1 = async (req, res, next) => {

  const user = await CommonHelper.getUserFromRequest(req)
  service
    .createOrder(req.body, user.id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const getDetailOrder = async (req, res, next) => {
  const { id } = req.params
  service
    .getDetailOrder(id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const getListOrder = async (req, res, next) => {
  const { page, size, userId, storeId, status } = req.query
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .getListOrder(page, size, userId, storeId, status)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const updateOrder = async (req, res, next) => {
  const { id } = req.params
  const { addressId, status } = req.body
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .updateOrder(id, addressId, status, user.id, user.role)
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
  createOrder,
  getDetailOrder,
  getListOrder,
  updateOrder,
  createOrderV1
}
