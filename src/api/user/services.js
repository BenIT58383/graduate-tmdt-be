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
import config from '../../common/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import jwtHelper from '../../common/helpers/jwt-helper'

const register = async (phone, password) => {
  const res = {}

  const phoneExist = await UserModel.findOne({ where: { phone } })
  if (phoneExist) {
    throw new APIError(MESSAGE_THROW_ERROR.PHONE_CONFLICT, httpStatus.CONFLICT)
  }

  const pass = bcrypt.hashSync(password, 10)

  const data = await UserModel.create({
    phone,
    password: pass,
    type: 1,
  })

  res.user = data
  return res
}

const login = async (phone, password) => {
  const user = await UserModel.findOne({ where: { phone } })

  const isPasswordValid = bcrypt.compareSync(password, user.password)

  if (!isPasswordValid) {
    throw new APIError(
      MESSAGE_THROW_ERROR.ERR_PHONE_OR_PASSWORD,
      httpStatus.BAD_REQUEST
    )
  }

  const refreshToken = jwt.sign({ phone }, config.REFRESH_TOKEN_SECRET, {
    // expiresIn: "10h" // it will be expired after 10 hours
    expiresIn: '30d', // it will be expired after 20 days
    //expiresIn: 120 // it will be expired after 120ms
    //expiresIn: "120s" // it will be expired after 120s
  })

  await UserModel.update({ refreshToken: refreshToken }, { where: { phone } })

  const dataForAccessToken = {
    id: user.id,
    code: user.code,
    phone: user.phone,
    type: user.type,
    refreshToken: refreshToken,
  }

  const token = jwt.sign(dataForAccessToken, config.ACCESS_TOKEN_SECRET, {
    expiresIn: '10d',
  })

  const dataForUser = {
    id: user.id,
    code: user.code,
    phone: user.phone,
    avatar: user.avatar,
    fullName: user.fullName,
    birthDay: user.birthDay,
  }

  return { user: dataForUser, token: token }
}

const createNewToken = async (refreshTokenAuth) => {
  let res = {}

  if (!refreshTokenAuth) {
    throw new UnauthorizedError()
  }

  const decode = jwt.decode(refreshTokenAuth.refreshTokenAuth)

  const user = await UserModel.findOne({ where: { phone: decode.phone } })

  let rfToken = user.refreshToken

  if (rfToken != refreshTokenAuth.refreshTokenAuth) {
    throw new ForbiddenError()
  }

  jwt.verify(rfToken, config.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) throw new ForbiddenError()
    const dataForAccessToken = {
      id: user.id,
      code: user.code,
      phone: user.phone,
      type: user.type,
    }

    res.token = jwt.sign(dataForAccessToken, config.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d',
    })
  })

  return res
}

const createUser = async (
  code,
  phone,
  password,
  fsIdCard,
  bsIdCard,
  avatar,
  fullName,
  birthDay,
  idCardNo,
  job,
  address,
  salary,
  education,
  marriage,
  bankNo,
  bankName,
  cardHolder
) => {
  const res = {}

  // const phoneExist = await UserModel.findOne({ where: { phone } })
  // if (phoneExist) {
  //   throw new APIError(MESSAGE_THROW_ERROR.PHONE_CONFLICT, httpStatus.CONFLICT)
  // }

  // const data = await UserModel.create({
  //   code,
  //   phone,
  //   password,
  //   fsIdCard,
  //   bsIdCard,
  //   avatar,
  //   fullName,
  //   birthDay,
  //   idCardNo,
  //   job,
  //   address,
  //   salary,
  //   education,
  //   marriage,
  //   bankNo,
  //   bankName,
  //   cardHolder,
  // })

  // res.user = data
  return res
}

const getDetailUser = async (id) => {
  let res = {}

  let queryString = `SELECT id, code, phone, password, fs_id_card as fsIdCard , bs_id_card as bsIdCard , avatar, full_name as fullName ,birth_day as birthDay , 
  id_card_no as idCardNo, job, address, salary, education, marriage, bank_no as bankNo, bank_name as bankName, card_holder as cardHolder 
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

  let queryString = `SELECT id, code, phone, fs_id_card as fsIdCard , bs_id_card as bsIdCard , avatar, full_name as fullName ,birth_day as birthDay , 
  id_card_no as idCardNo, job, address, salary, education, marriage, bank_no as bankNo, bank_name as bankName, card_holder as cardHolder 
  from user
  where true `

  if (code) {
    queryString += ` and code like '%${code}%' `
  }

  if (name) {
    queryString += ` and id like '%${name}%' `
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
  phone,
  code,
  password,
  type,
  fsIdCard,
  bsIdCard,
  avatar,
  fullName,
  birthDay,
  idCardNo,
  job,
  address,
  salary,
  education,
  marriage,
  bankNo,
  bankName,
  cardHolder
) => {
  let res = {}
  let pass = ''

  const phoneExist = await UserModel.findOne({ where: { phone } })
  if (!phoneExist) {
    throw new APIError(
      MESSAGE_THROW_ERROR.PHONE_NOT_FOUND,
      httpStatus.NOT_FOUND
    )
  }

  if (password) {
    pass = bcrypt.hashSync(password, 10)
  }

  const data = await UserModel.update(
    {
      code,
      password: pass,
      type,
      fsIdCard,
      bsIdCard,
      avatar,
      fullName,
      birthDay,
      idCardNo,
      job,
      address,
      salary,
      education,
      marriage,
      bankNo,
      bankName,
      cardHolder,
    },
    { where: { phone } }
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

export default {
  register,
  login,
  createNewToken,
  createUser,
  updateUser,
  getDetailUser,
  getListUsers,
  deleteUser,
}
