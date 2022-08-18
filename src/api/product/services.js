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
import { MESSAGE_THROW_ERROR, USER_TYPE, ACTIVE_STATUS } from '../../common/constant/index'
import UserModel from '../../sequelize/models/user'
import ProductModel from '../../sequelize/models/product'
import CategoryModel from '../../sequelize/models/category'
import UnitModel from '../../sequelize/models/unit'
import config from '../../common/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import jwtHelper from '../../common/helpers/jwt-helper'

const createProduct = async (
  storeId,
  categoryId,
  unitId,
  quantity,
  price,
  name,
  image1,
  image2,
  image3,
  image4,
  image5,
  description,
  userId
) => {
  const res = {}

  const data = await ProductModel.create({
    storeId,
    categoryId,
    unitId,
    quantity,
    price,
    name,
    image1,
    image2,
    image3,
    image4,
    image5,
    description,
    status: ACTIVE_STATUS.ACTIVE,
    createdBy: userId,
  })

  res.user = data
  return res
}

const getDetailProduct = async (id) => {
  let res = {}

  let queryString = `SELECT pd.id, pd.store_id as storeId, pd.category_id as categoryId, pd.unit_id as unitId, pd.quantity, 
  pd.price, pd.name, pd.image1, pd.image2, pd.image3, pd.image4, pd.image5, pd.description, pd.status,
  pd.created_at as createdAt, pd.created_by as createdBy, pd.updated_at as updatedAt, pd.updated_by as updatedBy,
  st.name as storeName,
  c.name as categoryName,
  u.name as unitName,
  us.name as userName, us.phone, us.email
  FROM product pd
  JOIN store st ON pd.store_id = st.id
  LEFT JOIN user us ON us.id = st.user_id 
  JOIN category c ON pd.category_id = c.id
  JOIN unit u ON pd.unit_id = u.id
  WHERE pd.id = '${id}'`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  if (!data) {
    throw new APIError(
      MESSAGE_THROW_ERROR.PRODUCT_NOTFOUND,
      httpStatus.NOT_FOUND
    )
  }

  res.product = data[0]
  return res
}

const getListProduct = async (page, size, name, categoryId, storeId, description) => {
  let res = {}
  let offset = (page - 1) * size

  let queryString = `SELECT pd.id, pd.store_id as storeId, pd.category_id as categoryId, pd.unit_id as unitId, pd.quantity, 
  pd.price, pd.name as productName, pd.image1, pd.image2, pd.image3, pd.image4, pd.image5, pd.description, pd.status,
  pd.created_at as createdAt, pd.created_by as createdBy, pd.updated_at as updatedAt, pd.updated_by as updatedBy,
  st.name as storeName,
  c.name as categoryName,
  u.name as unitName
  FROM product pd
  JOIN store st ON pd.store_id = st.id
  JOIN category c ON pd.category_id = c.id
  JOIN unit u ON pd.unit_id = u.id
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

  if (description) {
    queryString += ` and pd.description = '${description}' `
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
  quantity,
  price,
  name,
  image1,
  image2,
  image3,
  image4,
  image5,
  description,
  status,
  userId
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
      quantity,
      price,
      name,
      image1,
      image2,
      image3,
      image4,
      image5,
      description,
      status,
      updatedBy: userId,
    },
    { where: { id } }
  )

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

const createCategory = async (name, image1, image2, image3, userId) => {
  const res = {}

  if (name) {
    const categoryExist = await CategoryModel.findOne({ where: { name } })
    if (categoryExist) {
      throw new APIError(
        MESSAGE_THROW_ERROR.CATEGORY_CONFLICT,
        httpStatus.CONFLICT
      )
    }
  }

  const data = await CategoryModel.create({
    name,
    image1,
    image2,
    image3,
    createdBy: userId,
  })

  res.user = data
  return res
}

const getDetailCategory = async (id) => {
  let res = {}

  let queryString = `SELECT ct.id, ct.name, ct.image1, ct.image2, ct.image3,
  ct.created_at as createdAt, ct.created_by as createdBy, ct.updated_at as updatedAt, ct.updated_by as updatedBy
  FROM category ct
  WHERE ct.id = '${id}'`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  if (!data) {
    throw new APIError(
      MESSAGE_THROW_ERROR.CATEGORY_NOT_FOUND,
      httpStatus.NOT_FOUND
    )
  }

  res.category = data[0]
  return res
}

const getListCategory = async (page, size, name) => {
  let res = {}
  let offset = (page - 1) * size

  let queryString = `SELECT ct.id, ct.name, ct.image1, ct.image2, ct.image3,
  ct.created_at as createdAt, ct.created_by as createdBy, ct.updated_at as updatedAt, ct.updated_by as updatedBy
  FROM category ct
  WHERE true `

  if (name) {
    queryString += ` and ct.name like '%${name}%' `
  }

  queryString += ` order by ct.created_at desc`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  res.total = data.length
  res.categories = data.slice(offset, offset + size)
  return res
}

const updateCategory = async (id, name, image1, image2, image3, userId) => {
  let res = {}

  const categoryExist = await CategoryModel.findOne({ where: { id } })
  if (!categoryExist) {
    throw new APIError(
      MESSAGE_THROW_ERROR.CATEGORY_NOT_FOUND,
      httpStatus.NOT_FOUND
    )
  }

  const data = await CategoryModel.update(
    {
      name,
      image1,
      image2,
      image3,
      updatedBy: userId,
    },
    { where: { id } }
  )

  res.data = data
  return res
}

const deleteCategory = async (id) => {
  const res = {}

  const categoryExist = await CategoryModel.findOne({ where: { id } })
  if (!categoryExist) {
    throw new APIError(
      MESSAGE_THROW_ERROR.CATEGORY_NOT_FOUND,
      httpStatus.NOT_FOUND
    )
  }

  const data = await CategoryModel.destroy({ where: { id } })

  res.user = data
  return res
}

const createUnit = async (userId, name, description) => {
  const res = {}

  const unitExist = await UnitModel.findOne({ where: { name } })
  if (unitExist) {
    throw new APIError(MESSAGE_THROW_ERROR.UNIT_CONFLICT, httpStatus.CONFLICT)
  }

  const data = await UnitModel.create({
    name,
    description,
    createdBy: userId,
  })

  res.user = data
  return res
}

const getListUnit = async (page, size, name, description) => {
  let res = {}
  let offset = (page - 1) * size

  let queryString = `SELECT u.id, u.name, u.description,
  u.created_at as createdAt, u.created_by as createdBy, u.updated_at as updatedAt, u.updated_by as updatedBy
  FROM unit u
  WHERE true`

  if (name) {
    queryString += ` and u.name like '%${name}%' `
  }

  if (description) {
    queryString += ` and u.description like '%${description}%' `
  }

  queryString += ` order by u.created_at desc`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  res.total = data.length
  res.units = data.slice(offset, offset + size)
  return res
}

const deleteUnit = async (id) => {
  const res = {}

  const unitExist = await UnitModel.findOne({ where: { id } })
  if (!unitExist) {
    throw new APIError(MESSAGE_THROW_ERROR.UNIT_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  const data = await UnitModel.destroy({ where: { id } })

  res.user = data
  return res
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
