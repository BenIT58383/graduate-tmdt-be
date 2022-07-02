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

const createStore = async (req, res, next) => {
  const { name } = req.body
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .createStore(user.id, name)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const getDetailStore = async (req, res, next) => {
  const { id } = req.params
  service
    .getDetailStore(id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const getListStore = async (req, res, next) => {
  const { page, size, name, userId, isActive } = req.query
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .getListStore(page, size, name, userId, isActive)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const updateStore = async (req, res, next) => {
  const { id } = req.params
  const { name, isActive } = req.body
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .updateStore(id, name, isActive, user.id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const deleteStore = async (req, res, next) => {
  const { id } = req.params
  service
    .deleteStore(id)
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
  createStore,
  getDetailStore,
  getListStore,
  updateStore,
  deleteStore,
}
