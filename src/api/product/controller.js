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

const createProduct = async (req, res, next) => {
  const { storeId, categoryId, unitId, code, amount, price, name, image } =
    req.body
  service
    .createProduct(
      storeId,
      categoryId,
      unitId,
      code,
      amount,
      price,
      name,
      image
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

const getDetailProduct = async (req, res, next) => {
  const { id } = req.params
  service
    .getDetailProduct(id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const getListProduct = async (req, res, next) => {
  const { page, size, name, categoryId, storeId } = req.query
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .getListProduct(page, size, name, categoryId, storeId)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const updateProduct = async (req, res, next) => {
  const { id } = req.params
  const { storeId, categoryId, unitId, code, amount, price, name, image } =
    req.body
  service
    .updateProduct(
      id,
      storeId,
      categoryId,
      unitId,
      code,
      amount,
      price,
      name,
      image
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

const deleteProduct = async (req, res, next) => {
  const { id } = req.params
  service
    .deleteProduct(id)
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
  createProduct,
  getDetailProduct,
  getListProduct,
  updateProduct,
  deleteProduct,
}
