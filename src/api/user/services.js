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
import { MESSAGE_THROW_ERROR, USER_ROLE, ACTIVE_STATUS, CONFIG_TIME } from '../../common/constant/index'
import UserModel from '../../sequelize/models/user'
import AddressModel from '../../sequelize/models/address'
import config from '../../common/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import jwtHelper from '../../common/helpers/jwt-helper'
import dayjs from 'dayjs'

const register = async (userName, phone, email, password) => {

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
    status: ACTIVE_STATUS.ACTIVE,
    role: USER_ROLE.CUSTOMER
  })

  let res = {
    userName: data.userName,
    phone: data.phone,
    email: data.email,
  }

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

  const token = jwt.sign(dataForAccessToken, config.ACCESS_TOKEN_SECRET, {
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
    image1: user.image1,
    image2: user.image2,
    image3: user.image3,
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
  dateOfBirth,
  userId
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
    dateOfBirth,
    status: ACTIVE_STATUS.ACTIVE,
    createdBy: userId,
    createdAt: new Date(),
  })

  res.user = data
  return res
}

const getDetailUser = async (id) => {
  let res = {}

  let queryString = `SELECT us.id, us.user_name as userName, us.phone, us.email, us.role, us.image1, us.image2, us.image3, us.name,
  us.date_of_birth as dateOfBirth, us.status,
  us.created_at as createdAt, us.updated_at as updatedAt,
  st.id as storeId, st.name as storeName
  from user us
  left join store st on st.user_id = us.id
  where us.id = '${id}'`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  if (!data) {
    throw new APIError(MESSAGE_THROW_ERROR.USER_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  data[0].createdAt = dayjs(data.createdAt).format('DD/MM/YYYY HH:mm:ss')
  data[0].updatedAt = dayjs(data.updatedAt).format('DD/MM/YYYY HH:mm:ss')

  res.user = data[0]
  return res
}

const getListUsers = async (page, size, search, status, startDate, endDate) => {
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
  date_of_birth as dateOfBirth, status,
  created_at as createdAt, updated_at as updatedAt
  from user
  where true `

  if (search) {
    queryString += ` 
    and (name like '%${search}%'
    or phone like '%${search}%'
    or email like '%${search}%'
    or user_name like '%${search}%') `
  }

  if (status) {
    queryString += ` and status = ${status} `
  }

  if (startDate) {
    queryString += ` and created_at >= '${startDate} ${CONFIG_TIME.START_TIME}' `
  }

  if (endDate) {
    queryString += ` and created_at <= '${endDate} ${CONFIG_TIME.END_TIME}' `
  }

  queryString += ` order by createdAt desc`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  if (data && data.length > 0) {
    for (let item of data) {
      item.createdAt = dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss')
      item.updatedAt = dayjs(item.updatedAt).format('DD/MM/YYYY HH:mm:ss')
    }
  }

  res.total = data.length
  // res.users = data.slice(offset, offset + size)
  res.users = data
  return res
}

const updateUser = async (
  id, userName, phone, email, role, name, image1, image2, image3, dateOfBirth, status, isOnline, userId, password
) => {
  let res = {}
  let pass = ''

  const userExist = await UserModel.findOne({ where: { id: id } })

  if (!userExist) {
    throw new APIError(MESSAGE_THROW_ERROR.USER_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  if (password) {
    pass = bcrypt.hashSync(password, 10)
  }

  const data = await UserModel.update(
    {
      userName: userName ? userName : userExist.userName,
      phone: phone ? phone : userExist.phone,
      email: email ? email : userExist.email,
      role: role ? role : userExist.role,
      name: name ? name : userExist.name,
      image1: image1 ? image1 : userExist.image1,
      image2: image2 ? image2 : userExist.image2,
      image3: image3 ? image3 : userExist.image3,
      dateOfBirth: dateOfBirth ? dateOfBirth : userExist.dateOfBirth,
      status: status ? status : userExist.status,
      isOnline: isOnline ? isOnline : userExist.isOnline,
      password: pass ? pass : userExist.password,
      updatedBy: userId,
      updatedAt: new Date()
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
    createdAt: new Date()
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
      updatedAt: new Date()
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
