/* eslint-disable prettier/prettier */
import httpStatus from 'http-status'
import { Op } from 'sequelize'
import CryptoJS from 'crypto-js'
import app from '../../index'
import {
  APIError,
  APIErrorV2,
  UnauthorizedError,
  ForbiddenError,
} from '../../common/helpers/api-error'
import { masterDb as Sequelize } from '../../sequelize/index'
import { MESSAGE_THROW_ERROR, USER_TYPE } from '../../common/constant/index'
import UserModel from '../../sequelize/models/user'
import AddressModel from '../../sequelize/models/address'
import config from '../../common/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import jwtHelper from '../../common/helpers/jwt-helper'

const register = async (fullName, phone, password) => {
  const res = {}

  const phoneExist = await UserModel.findOne({ where: { phone } })
  if (phoneExist) {
    throw new APIError(MESSAGE_THROW_ERROR.PHONE_CONFLICT, httpStatus.CONFLICT)
  }

  const pass = bcrypt.hashSync(password, 10)

  const data = await UserModel.create({
    fullName,
    phone,
    password: pass,
    type: 1,
  })

  res.user = data
  return res
}

const login = async (phone, password) => {
  try {
    const user = await UserModel.findOne({ where: { phone } })

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new APIError(
        MESSAGE_THROW_ERROR.ERR_PHONE_OR_PASSWORD,
        httpStatus.NOT_FOUND
      )
    }

    const dataForAccessToken = {
      id: user.id,
      code: user.code,
      phone: user.phone,
      role: user.role,
    }

    const token = jwt.sign(dataForAccessToken, config.ACCESS_TOKEN_SECRET, {
      expiresIn: '120d',
    })

    const dataForUser = {
      id: user.id,
      code: user.code,
      phone: user.phone,
      avatar: user.avatar,
      fullName: user.fullName,
      birthDay: user.birthDay,
      token: token
    }

    return dataForUser
    // return { "ben": "1000" }
  } catch (error) {
    return error
  }

}

const createUser = async (
  phone,
  password,
  role,
  avatar,
  fullName,
  dateOfBirth
) => {
  const res = {}
  const userCode = 'desau'

  const phoneExist = await UserModel.findOne({ where: { phone } })
  if (phoneExist) {
    throw new APIError(MESSAGE_THROW_ERROR.PHONE_CONFLICT, httpStatus.CONFLICT)
  }

  const hashPassword = bcrypt.hashSync(password, 10)

  const data = await UserModel.create({
    phone,
    password: hashPassword,
    code: userCode,
    role,
    avatar,
    fullName,
    dateOfBirth,
  })

  res.user = data
  return res
}

const getDetailUser = async (id) => {
  let res = {}

  let queryString = `SELECT id, code, phone, avatar, full_name as fullName,
  date_of_birth as dateOfBirth, role,
  created_at as createdAt, updated_at as updatedAt
  from user where id = '${id}'`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  if (!data) {
    throw new APIError(MESSAGE_THROW_ERROR.USER_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  res.user = data[0]
  return res
}

const getListUsers = async (page, size, code, name, phone, user) => {
  // if (user == '') {
  //   throw new APIError(MESSAGE_THROW_ERROR.LOGIN, httpStatus.FORBIDDEN)
  // }

  // if (
  //   user.type != USER_TYPE.ADMIN ||
  //   user.type == undefined ||
  //   user.type == ''
  // ) {
  //   throw new APIError(MESSAGE_THROW_ERROR.AUTH, httpStatus.UNAUTHORIZED)
  // }

  let res = {}
  let offset = (page - 1) * size

  let queryString = `SELECT id, code, phone, avatar, full_name as fullName,
  date_of_birth as dateOfBirth, role,
  created_at as createdAt, updated_at as updatedAt
  from user
  where true `

  if (code) {
    queryString += ` and code like '%${code}%' `
  }

  if (name) {
    queryString += ` and full_name like '%${name}%' `
  }

  if (phone) {
    queryString += ` and phone like '%${phone}%' `
  }

  queryString += ` order by created_at desc`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  res.total = data.length
  res.users = data.slice(offset, offset + size)
  return res
}

const updateUser = async (
  id,
  password,
  role,
  avatar,
  fullName,
  dateOfBirth
) => {
  let res = {}
  let pass = ''

  const userExist = await UserModel.findOne({ where: { id } })
  if (!userExist) {
    throw new APIError(MESSAGE_THROW_ERROR.USER_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  if (password) {
    pass = bcrypt.hashSync(password, 10)
  }

  const data = await UserModel.update(
    {
      password: pass,
      role,
      avatar,
      fullName,
      dateOfBirth,
    },
    { where: { id } }
  )

  res.data = data
  return res
}

const deleteUser = async (id) => {
  const res = {}

  const userExist = await UserModel.findOne({ where: { id } })
  if (!userExist) {
    throw new APIError(MESSAGE_THROW_ERROR.USER_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  const data = await UserModel.destroy({ where: { id } })

  res.user = data
  return res
}

const createAddress = async (
  storeId,
  customerName,
  phone,
  location,
  isDefault,
  type,
  userId
) => {
  const res = {}

  const data = await AddressModel.create({
    userId: userId,
    storeId,
    customerName,
    phone,
    location,
    isDefault,
    type,
    createdBy: userId,
  })

  res.address = data
  return res
}

const getDetailAddress = async (id) => {
  let res = {}

  let queryString = `SELECT ad.id, ad.user_id as userId, ad.store_id as storeId, ad.customer_name as customerName, ad.phone, ad.location, ad.is_default as isDefault, ad.type,
  ad.created_at as createdAt, ad.created_by as createdBy, ad.updated_at as updatedAt, ad.updated_by as updatedBy,
  us.full_name as userName,
  st.name as storeName
  FROM address ad
  LEFT JOIN user us ON us.id = ad.user_id
  LEFT JOIN store st ON st.id = ad.store_id
  WHERE ad.id = '${id}'`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  if (!data) {
    throw new APIError(
      MESSAGE_THROW_ERROR.ADDRESS_NOT_FOUND,
      httpStatus.NOT_FOUND
    )
  }

  res.address = data[0]
  return res
}

const getListAddress = async (page, size, userId, storeId, isDefault, type) => {
  let res = {}
  let offset = (page - 1) * size

  let queryString = `SELECT ad.id, ad.user_id as userId, ad.store_id as storeId, ad.customer_name as customerName, ad.phone, ad.location, ad.is_default as isDefault, ad.type,  
  ad.created_at as createdAt, ad.created_by as createdBy, ad.updated_at as updatedAt, ad.updated_by as updatedBy,
  us.full_name as userName,
  st.name as storeName
  FROM address ad
  JOIN user us ON us.id = ad.user_id
  LEFT JOIN store st ON st.id = ad.store_id
  WHERE true`

  if (userId) {
    queryString += ` and ad.user_id = '${userId}' `
  }
  if (storeId) {
    queryString += ` and ad.store_id = '${storeId}' `
  }
  if (type) {
    queryString += ` and ad.type = '${type}' `
  }

  if (isDefault) {
    queryString += ` and ad.is_default = '${isDefault}' `
  }

  queryString += ` order by ad.created_at desc`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  res.total = data.length
  res.addresses = data.slice(offset, offset + size)
  return res
}

const updateAddress = async (
  id,
  storeId,
  customerName,
  phone,
  location,
  isDefault,
  type,
  userId
) => {
  let res = {}

  const addressExist = await AddressModel.findOne({ where: { id } })
  if (!addressExist) {
    throw new APIError(
      MESSAGE_THROW_ERROR.ADDRESS_NOT_FOUND,
      httpStatus.NOT_FOUND
    )
  }

  const data = await AddressModel.update(
    {
      storeId,
      customerName,
      phone,
      location,
      isDefault,
      type,
      updatedBy: userId,
    },
    { where: { id } }
  )

  res.data = data
  return res
}

const deleteAddress = async (id) => {
  const res = {}

  const addressExist = await AddressModel.findOne({ where: { id } })
  if (!addressExist) {
    throw new APIError(
      MESSAGE_THROW_ERROR.ADDRESS_NOT_FOUND,
      httpStatus.NOT_FOUND
    )
  }

  const data = await AddressModel.destroy({ where: { id } })

  res.user = data
  return res
}

export default {
  register,
  login,
  createUser,
  updateUser,
  getDetailUser,
  getListUsers,
  deleteUser,
  createAddress,
  getDetailAddress,
  getListAddress,
  updateAddress,
  deleteAddress,
}
