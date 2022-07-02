/* eslint-disable prettier/prettier */
import httpStatus from 'http-status'
import { Op } from 'sequelize'
import CryptoJS from 'crypto-js'
import app from '../../index'
// import jwtHelper from '../../common/helpers/jwt-helper'
import {
  APIError,
  APIErrorV2,
  UnauthorizedError,
  ForbiddenError,
} from '../../common/helpers/api-error'
import { masterDb as Sequelize } from '../../sequelize/index'
import { MESSAGE_THROW_ERROR, USER_TYPE } from '../../common/constant/index'
import UserModel from '../../sequelize/models/user'
import ProductModel from '../../sequelize/models/product'
import StoreModel from '../../sequelize/models/store'
import config from '../../common/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import jwtHelper from '../../common/helpers/jwt-helper'

const createStore = async (userId, name) => {
  const res = {}

  const storeNameExist = await StoreModel.findOne({ where: { name } })
  if (storeNameExist) {
    throw new APIError(
      MESSAGE_THROW_ERROR.STORE_NAME_CONFLICT,
      httpStatus.CONFLICT
    )
  }

  const data = await StoreModel.create({
    userId: userId,
    name,
    createdBy: userId,
  })

  res.user = data
  return res
}

const getDetailStore = async (id) => {
  let res = {}

  let queryString = `SELECT st.id, st.user_id as userId, st.name as storeName,
  st.created_at as createdAt, st.created_by as createdBy, st.updated_at as updatedAt, st.updated_by as updatedBy,
  us.full_name as userName
  FROM store st
  LEFT JOIN user us ON us.id = st.user_id
  WHERE st.id = '${id}'`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  if (!data) {
    throw new APIError(
      MESSAGE_THROW_ERROR.STORE_NOT_FOUND,
      httpStatus.NOT_FOUND
    )
  }

  res.user = data[0]
  return res
}

const getListProduct = async (page, size, name, categoryId, storeId) => {
  let res = {}
  let offset = (page - 1) * size

  let queryString = `SELECT pd.id, pd.store_id as storeId, pd.category_id as categoryId, pd.unit_id as unitId, pd.code, pd.amount, pd.price, pd.name as productName, pd.image, 
  pd.created_at as createdAt, pd.created_by as createdBy, pd.updated_at as updatedAt, pd.updated_by as updatedBy,
  st.name as storeName,
  c.name as categoryName,
  u.name as unitName
  FROM product pd
  LEFT JOIN store st ON pd.store_id = st.id
  LEFT JOIN category c ON pd.category_id = c.id
  LEFT JOIN unit u ON pd.unit_id = u.id
  WHERE true`

  if (name) {
    queryString += ` and pd.name like '%${name}%' `
  }

  if (categoryId) {
    queryString += ` and pd.category_id = '${categoryId}' `
  }

  if (storeId) {
    queryString += ` and pd.store_id = '${storeId}' `
  }

  queryString += ` order by pd.created_at desc`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  res.total = data.length
  res.products = data.slice(offset, offset + size)
  return res
}

const updateProduct = async (
  id,
  storeId,
  categoryId,
  unitId,
  code,
  amount,
  price,
  name,
  image
) => {
  let res = {}

  const productExist = await ProductModel.findOne({ where: { id } })
  if (!productExist) {
    throw new APIError(
      MESSAGE_THROW_ERROR.PRODUCT_NOTFOUND,
      httpStatus.NOT_FOUND
    )
  }

  const data = await ProductModel.update(
    {
      storeId,
      categoryId,
      unitId,
      code,
      amount,
      price,
      name,
      image,
    },
    { where: { id } }
  )

  console.log(1111111, data)

  res.data = data
  return res
}

const deleteProduct = async (id) => {
  const res = {}

  const productExist = await ProductModel.findOne({ where: { id } })
  if (!productExist) {
    throw new APIError(
      MESSAGE_THROW_ERROR.PRODUCT_NOTFOUND,
      httpStatus.NOT_FOUND
    )
  }

  const data = await ProductModel.destroy({ where: { id } })

  res.user = data
  return res
}

export default {
  createStore,
  getDetailStore,
}
