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

const register = async (userName, phone, email, password) => {
  const res = {}

  if (email) {
    const emailExist = await UserModel.findOne({ where: { email } })
    if (emailExist) {
      throw new APIError(MESSAGE_THROW_ERROR.EMAIL_CONFLICT, httpStatus.CONFLICT)
    }
  } else {
    email = null
  }

  if (userName && phone) {
    const userNameExist = await UserModel.findOne({ where: { userName } })
    if (userNameExist) {
      throw new APIError(MESSAGE_THROW_ERROR.USER_NAME_CONFLICT, httpStatus.CONFLICT)
    }

    const phoneExist = await UserModel.findOne({ where: { phone } })
    if (phoneExist) {
      throw new APIError(MESSAGE_THROW_ERROR.PHONE_CONFLICT, httpStatus.CONFLICT)
    }
  } else {
    userName = null
    phone = null
  }

  const pass = bcrypt.hashSync(password, 10)

  const data = await UserModel.create({
    userName,
    phone,
    email,
    password: pass,
    type: 1,
  })

  res.user = data
  return res
}

const login = async (userNamePhone, email, password) => {
  let userName
  let userPhone
  let userEmail
  let user = {}

  if (userNamePhone) {
    userName = await UserModel.findOne({ where: { userName: userNamePhone }, raw: true })
    userPhone = await UserModel.findOne({ where: { phone: userNamePhone }, raw: true })
  }

  if (email) {
    userEmail = await UserModel.findOne({ where: { email }, raw: true })
  }

  if (userName && bcrypt.compareSync(password, userName.password)) {
    user = userName
  } else if (userPhone && bcrypt.compareSync(password, userPhone.password)) {
    user = userPhone
  } else if (userEmail && bcrypt.compareSync(password, userEmail.password)) {
    user = userEmail
  } else {
    throw new APIError(
      MESSAGE_THROW_ERROR.ERR_USER_NAME_PHONE_EMAIL_OR_PASSWORD,
      httpStatus.NOT_FOUND
    )
  }

  const dataForAccessToken = {
    id: user.id,
    code: user.code,
    phone: user.phone,
    userName: user.userName,
    role: user.role,
  }

  const token = jwt.sign(dataForAccessToken, 'ben$author', {
    expiresIn: '120d',
  })

  const dataForUser = {
    id: user.id,
    code: user.code,
    phone: user.phone,
    userName: user.userName,
    avatar: user.avatar,
    name: user.name,
    birthDay: user.birthDay,
    token: token
  }

  return dataForUser
}

const createUser = async (
  userName,
  phone,
  email,
  password,
  role,
  name,
  image1,
  image2,
  image3,
  dateOfBirth
) => {
  const res = {}

  //handle phone
  if (phone) {
    const phoneExist = await UserModel.findOne({ where: { phone } })
    if (phoneExist) {
      throw new APIError(MESSAGE_THROW_ERROR.PHONE_CONFLICT, httpStatus.CONFLICT)
    }
  } else {
    phone = null
  }

  if (userName) {
    const userNameExist = await UserModel.findOne({ where: { userName } })
    if (userNameExist) {
      throw new APIError(MESSAGE_THROW_ERROR.USER_NAME_CONFLICT, httpStatus.CONFLICT)
    }
  } else {
    userName = null
  }

  if (email) {
    const phoneExist = await UserModel.findOne({ where: { email } })
    if (phoneExist) {
      throw new APIError(MESSAGE_THROW_ERROR.EMAIL_CONFLICT, httpStatus.CONFLICT)
    }
  } else {
    email = null
  }

  const hashPassword = bcrypt.hashSync(password, 10)

  const data = await UserModel.create({
    userName,
    phone,
    email,
    password: hashPassword,
    role,
    image1,
    image2,
    image3,
    name,
    dateOfBirth
  })

  res.user = data
  return res
}

const getDetailUser = async (id) => {
  let res = {}

  let queryString = `SELECT us.id, us.user_name as userName, us.phone, us.email, us.role, us.image1, us.image2, us.image3, us.name,
  us.date_of_birth as dateOfBirth, us.status, us.is_online as isOnline,
  us.created_at as createdAt, us.updated_at as updatedAt,
  st.id as storeId
  from user us
  left join store st on st.user_id = us.id
  where us.id = '${id}'`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  if (!data) {
    throw new APIError(MESSAGE_THROW_ERROR.USER_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  res.user = data[0]
  return res
}

const getListUsers = async (page, size, code, name, phone, email, userName) => {
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

  let queryString = `SELECT id, user_name as userName, phone, email, role, image1, image2, image3, name,
  date_of_birth as dateOfBirth, status, is_online as isOnline,
  created_at as createdAt, updated_at as updatedAt
  from user
  where true `

  if (code) {
    queryString += ` and code like '%${code}%' `
  }

  if (name) {
    queryString += ` and name like '%${name}%' `
  }

  if (phone) {
    queryString += ` and phone like '%${phone}%' `
  }

  if (email) {
    queryString += ` and email like '%${email}%' `
  }

  if (userName) {
    queryString += ` and user_name like '%${userName}%' `
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
  id, userName, phone, email, role, name, image1, image2, image3, dateOfBirth, status, isOnline, userId
) => {
  let res = {}

  const userExist = await UserModel.findOne({ where: { id } })
  if (!userExist) {
    throw new APIError(MESSAGE_THROW_ERROR.USER_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  const data = await UserModel.update(
    {
      userName,
      phone,
      email,
      role,
      name,
      image1,
      image2,
      image3,
      dateOfBirth,
      status,
      isOnline,
      updatedBy: userId,
    },
    { where: { id } }
  )

  res.data = data
  return res
}

const updatePasswordUser = async (
  id, password, userId
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
      updatedBy: userId,
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
  us.name as userName,
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
  us.name as userName,
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
