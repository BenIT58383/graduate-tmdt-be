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
  const { userId, name, image1, image2, image3, description, linkSupport } = req.body
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .createStore(userId, name, image1, image2, image3, description, linkSupport, user.id)
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
  const { page, size, search, userId, status, startDate, endDate } = req.query
  service
    .getListStore(page, size, search, userId, status, startDate, endDate)
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
  const { userId, name, image1, image2, image3, description, linkSupport, status } = req.body
  const user = await CommonHelper.getUserFromRequest(req)

  service
    .updateStore(id, userId, name, image1, image2, image3, description, linkSupport, status, user.id)
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
  const user = await CommonHelper.getUserFromRequest(req)
  service
    .deleteStore(id, user.id)
    .then((data) => {
      return new APISuccess(res, {
        data: data,
      })
    })
    .catch((err) => {
      next(err)
    })
}

const getStatistical = async (req, res, next) => {
  const { storeId, startDate, endDate } = req.query
  service
    .getStatistical(storeId, startDate, endDate)
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
  getStatistical
}
