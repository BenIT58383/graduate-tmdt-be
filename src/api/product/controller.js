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
  const { storeId, categoryId, unitId, quantity, price, name, description } = req.body
  const user = await CommonHelper.getUserFromRequest(req)
  const { files } = req;
  service
    .createProduct(
      files,
      storeId,
      categoryId,
      unitId,
      quantity,
      price,
      name,
      description,
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
  const { page, size, name, categoryId, storeId, description } = req.query
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .getListProduct(page, size, name, categoryId, storeId, description)
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
  const { files } = req;
  const { id } = req.params
  const { storeId, categoryId, unitId, code, quantity, price, name, description, status } =
    req.body
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .updateProduct(
      files,
      id,
      storeId,
      categoryId,
      unitId,
      code,
      quantity,
      price,
      name,
      description,
      status,
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

const createCategory = async (req, res, next) => {
  const { files } = req;
  const { name } = req.body
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .createCategory(files, name, user.id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const getDetailCategory = async (req, res, next) => {
  const { id } = req.params
  service
    .getDetailCategory(id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const getListCategory = async (req, res, next) => {
  const { page, size, name } = req.query
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .getListCategory(page, size, name)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const updateCategory = async (req, res, next) => {
  const { files } = req;
  const { id } = req.params
  const { name } = req.body
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .updateCategory(files, id, name, user.id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const deleteCategory = async (req, res, next) => {
  const { id } = req.params
  service
    .deleteCategory(id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const createUnit = async (req, res, next) => {
  const { name, description } = req.body
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .createUnit(user.id, name, description)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const getListUnit = async (req, res, next) => {
  const { page, size, name, description } = req.query
  service
    .getListUnit(page, size, name, description)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const deleteUnit = async (req, res, next) => {
  const { id } = req.params
  service
    .deleteUnit(id)
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
  createCategory,
  getDetailCategory,
  getListCategory,
  updateCategory,
  deleteCategory,
  createUnit,
  getListUnit,
  deleteUnit,
}
