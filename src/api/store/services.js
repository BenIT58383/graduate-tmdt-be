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
import {
  MESSAGE_THROW_ERROR,
  USER_ROLE,
  STATUS_STORE,
  CONFIG_TIME,
  ACTIVE_STATUS,
  CONFIG_ORDER_STATUS
} from '../../common/constant/index'
import UserModel from '../../sequelize/models/user'
import ProductModel from '../../sequelize/models/product'
import StoreModel from '../../sequelize/models/store'
import config from '../../common/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import jwtHelper from '../../common/helpers/jwt-helper'
import dayjs from 'dayjs'

const createStore = async (userId, name, image1, image2, image3, description, linkSupport, createdBy) => {
  const res = {}

  const storeNameExist = await StoreModel.findOne({ where: { name } })
  if (storeNameExist) {
    throw new APIError(
      MESSAGE_THROW_ERROR.STORE_NAME_CONFLICT,
      httpStatus.CONFLICT
    )
  }

  const data = await StoreModel.create({
    userId: userId ? userId : createdBy,
    name,
    description,
    linkSupport,
    image1,
    image2,
    image3,
    status: STATUS_STORE.WAITING_FOR_APPROVED,
    createdBy: createdBy,
    createdAt: new Date(),
  })

  res.user = data
  return res
}

const getDetailStore = async (id) => {
  let res = {}

  let queryString = `SELECT st.id, st.user_id as userId, st.name as storeName, st.status, 
  st.image1, st.image2, st.image3, st.description, st.link_support as linkSupport,
  st.created_at as createdAt, st.created_by as createdBy, st.updated_at as updatedAt, st.updated_by as updatedBy,
  us.name as userName, us.phone
  FROM store st
  JOIN user us ON us.id = st.user_id
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

  res.store = data[0]
  return res
}

const getListStore = async (page, size, search, userId, status, startDate, endDate) => {
  let res = {}
  let offset = (page - 1) * size

  let queryString = `SELECT st.id, st.user_id as userId, st.name as storeName, st.status, 
  st.image1, st.image2, st.image3, st.description, st.link_support as linkSupport,
  st.created_at as createdAt, st.created_by as createdBy, st.updated_at as updatedAt, st.updated_by as updatedBy,
  us.name as userName
  FROM store st
  LEFT JOIN user us ON us.id = st.user_id
  WHERE true`

  if (search) {
    queryString += ` and (st.name like '%${search}%' or st.description like '%${search}%' or us.name like '%${search}%') `
  }

  if (userId) {
    queryString += ` and st.user_id = '${userId}' `
  }

  if (status) {
    queryString += ` and st.status = '${status}' `
  }

  if (startDate) {
    queryString += ` and st.created_at >= '${startDate} ${CONFIG_TIME.START_TIME}' `
  }

  if (endDate) {
    queryString += ` and st.created_at <= '${endDate} ${CONFIG_TIME.END_TIME}' `
  }

  queryString += ` order by st.created_at desc`

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
  res.stores = data.slice(offset, offset + size)
  return res
}

const updateStore = async (id, userId, name, image1, image2, image3, description, linkSupport, status, updatedBy) => {
  let res = {}
  let tran = await Sequelize.transaction()

  try {
    const storeExist = await StoreModel.findOne({ where: { id } })
    if (!storeExist) {
      return MESSAGE_THROW_ERROR.STORE_NOT_FOUND
    }

    const data = await StoreModel.update(
      {
        userId: userId ? userId : updatedBy,
        name: name ? name : storeExist.name,
        image1: image1 ? image1 : storeExist.image1,
        image2: image2 ? image2 : storeExist.image2,
        image3: image3 ? image3 : storeExist.image3,
        description: description ? description : storeExist.description,
        linkSupport: linkSupport ? linkSupport : storeExist.linkSupport,
        status: status ? status : storeExist.status,
        updatedBy: updatedBy,
        updatedAt: new Date(),
      },
      { where: { id: id }, transaction: tran }
    )
    //handle update role for user
    if (status === STATUS_STORE.ACTIVE) {
      await UserModel.update(
        { role: USER_ROLE.STORE },
        { where: { id: userId ? userId : updatedBy, status: ACTIVE_STATUS.ACTIVE }, transaction: tran }
      )
    }

    const storeOfUserExist = await StoreModel.findAll({
      where: { userId: userId ? userId : updatedBy, status: STATUS_STORE.ACTIVE },
    })

    if (storeOfUserExist.length === 0) {
      await UserModel.update(
        { role: USER_ROLE.CUSTOMER },
        { where: { id: userId ? userId : updatedBy, status: ACTIVE_STATUS.ACTIVE }, transaction: tran }
      )
    }

    res.data = data
    await tran.commit()
    return res
  } catch (error) {
    await tran.rollback()
    throw new APIError("cập nhật thất bại", httpStatus.BAD_REQUEST)
  }
}

const deleteStore = async (id, userId) => {
  const res = {}

  const storeExist = await StoreModel.findOne({ where: { id } })
  if (!storeExist) {
    throw new APIError(
      MESSAGE_THROW_ERROR.STORE_NOT_FOUND,
      httpStatus.NOT_FOUND
    )
  }

  const data = await StoreModel.destroy({ where: { id } })

  //handle update role for user
  const storeOfUserExist = await StoreModel.findAll({
    where: { userId: userId },
  })

  if (storeOfUserExist.length === 0) {
    await UserModel.update(
      { role: USER_ROLE.CUSTOMER },
      { where: { id: userId } }
    )
  }

  res.user = data
  return res
}

const getStatistical = async (storeId, startDate, endDate) => {
  let res = {}

  //get total money
  let queryTotalBenefit = `select sum(odd.quantity * odd.price) as total
  from graduate.order od 
  join graduate.order_detail odd on odd.order_id = od.id
  where odd.store_id = '${storeId}' and od.status = ${CONFIG_ORDER_STATUS.FINISHED}`

  const totalBenefit = await Sequelize.query(queryTotalBenefit, {
    type: Sequelize.QueryTypes.SELECT,
  })

  //get list category
  let sqlCategory = `select DISTINCT ct.id, ct.name  
  from graduate.product pd
  join graduate.category ct on ct.id = pd.category_id
  where pd.store_id = '${storeId}'`

  const list_category = await Sequelize.query(sqlCategory, {
    type: Sequelize.QueryTypes.SELECT,
  })


  let totalMoneySaleSeed = 0
  let totalMoneySaleFruit = 0
  let totalMoneySaleVegetables = 0
  let totalMoneySaleVegetables1 = 0
  let totalMoneySaleRice = 0
  let totalMoneySaleIngredient = 0
  let totalMoneySaleIngredient1 = 0
  let other = 0

  for (let category of list_category) {

    let sqlTotalBenefitByCategory = `select sum(odd.price * odd.quantity) as total 
    from graduate.order od
    join graduate.order_detail odd on odd.order_id = od.id
    join graduate.product pd on pd.id = odd.product_id
    where odd.store_id = '${storeId}' and od.status = ${CONFIG_ORDER_STATUS.FINISHED} and pd.category_id = '${category.id}'`

    const totalBenefitByCategory = await Sequelize.query(sqlTotalBenefitByCategory, {
      type: Sequelize.QueryTypes.SELECT,
    })

    switch (category.name) {
      case 'Hạt':
        totalMoneySaleSeed = totalBenefitByCategory[0] ? totalBenefitByCategory[0].total : 0
        break;
      case 'Rau củ':
        totalMoneySaleVegetables = totalBenefitByCategory[0] ? totalBenefitByCategory[0].total : 0
        break;
      case 'Trái cây':
        totalMoneySaleFruit = totalBenefitByCategory[0] ? totalBenefitByCategory[0].total : 0
        break;
      case 'Rau xanh':
        totalMoneySaleVegetables1 = totalBenefitByCategory[0] ? totalBenefitByCategory[0].total : 0
        break;
      case 'Gạo':
        totalMoneySaleRice = totalBenefitByCategory[0] ? totalBenefitByCategory[0].total : 0
        break;
      case 'Nguyên liệu':
        totalMoneySaleIngredient = totalBenefitByCategory[0] ? totalBenefitByCategory[0].total : 0
        break;
      case 'Gia vị':
        totalMoneySaleIngredient1 = totalBenefitByCategory[0] ? totalBenefitByCategory[0].total : 0
        break;
      default:
        other = totalBenefitByCategory[0] ? totalBenefitByCategory[0].total : 0
    }
  }

  res.totalBenefit = totalBenefit[0].total
  res.totalMoneySaleSeed = totalMoneySaleSeed
  res.totalMoneySaleFruit = totalMoneySaleFruit
  res.totalMoneySaleVegetables = totalMoneySaleVegetables
  res.totalMoneySaleVegetables1 = totalMoneySaleVegetables1
  res.totalMoneySaleRice = totalMoneySaleRice
  res.totalMoneySaleIngredient = totalMoneySaleIngredient
  res.totalMoneySaleIngredient1 = totalMoneySaleIngredient1
  res.other = other

  return res
}

export default {
  createStore,
  getDetailStore,
  getListStore,
  updateStore,
  deleteStore,
  getStatistical
}
