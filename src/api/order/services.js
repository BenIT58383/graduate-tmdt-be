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
  CONFIG_ORDER_STATUS,
} from '../../common/constant/index'
import UserModel from '../../sequelize/models/user'
import OrderModel from '../../sequelize/models/order'
import OrderDetailModel from '../../sequelize/models/order_detail'
import ProductModel from '../../sequelize/models/product'
import config from '../../common/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import jwtHelper from '../../common/helpers/jwt-helper'

const createOrder = async (userId, products, addressId, note, createdBy) => {
  let tran = await Sequelize.transaction()
  try {
    const res = {}

    if (!products || products.length == 0) {
      return MESSAGE_THROW_ERROR.PRODUCT_NOT_EMPTY
    }

    //create order
    const data = await OrderModel.create(
      {
        userId,
        addressId,
        status: CONFIG_ORDER_STATUS.NEW,
        note,
        createdBy: createdBy,
      },
      { transaction: tran }
    )

    //handle products
    for (let product of products) {
      const productExist = await ProductModel.findOne({
        where: { id: product.id },
        transaction: tran,
      })

      //check validate
      if (productExist.quantity < product.quantity) {
        return MESSAGE_THROW_ERROR.QUANTITY_PRODUCT_AND_ORDER
      }

      if (!productExist) {
        return MESSAGE_THROW_ERROR.PRODUCT_NOTFOUND
      }

      //create order detail
      await OrderDetailModel.create(
        {
          orderId: data.id,
          productId: product.id,
          storeId: product.storeId,
          quantity: product.quantity,
          price: product.price,
          createdBy: createdBy,
        },
        { transaction: tran }
      )

      //update product
      await ProductModel.update(
        { quantity: productExist.quantity - product.quantity },
        { where: { id: product.id }, transaction: tran }
      )
    }

    res.order = data
    await tran.commit()
    return res
  } catch (error) {
    await tran.rollback()
    throw new APIError(error, httpStatus.BAD_REQUEST)
  }
}

const getDetailOrder = async (id) => {
  let res = {}
  let totalPrice = 0

  const dataOrderDetail = await Sequelize.query(
    `SELECT odd.product_id, odd.quantity, odd.price, odd.store_id 
      FROM graduate.order_detail odd
      WHERE odd.order_id = '${id}'`,
    {
      type: Sequelize.QueryTypes.SELECT,
    }
  )

  totalPrice = dataOrderDetail.reduce((total, element) => {
    return total + element.price * element.quantity
  }, totalPrice)

  let queryString = `SELECT od.id, od.code, od.user_id as userId, od.status, od.note,
  od.created_at as createdAt, od.created_by as createdBy, od.updated_at as updatedAt, od.updated_by as updatedBy,
  us.name as userName, 
  od.address_id as addressId, ad.customer_name as customerName, ad.phone as customerPhone, ad.location
  FROM graduate.order od 
  JOIN graduate.user us ON us.id = od.user_id
  JOIN graduate.address ad ON ad.id = od.address_id
  WHERE od.id = '${id}'`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  if (!data) {
    throw new APIError(
      MESSAGE_THROW_ERROR.ORDER_NOT_FOUND,
      httpStatus.NOT_FOUND
    )
  }
  data[0].products = dataOrderDetail
  data[0].totalPrice = totalPrice

  res.order = data[0]
  return res
}

const getListOrder = async (page, size, userId, storeId, status) => {
  let res = {}
  let offset = (page - 1) * size
  let totalPrice = 0

  let queryString = `SELECT od.id, od.code, od.user_id as userId, od.status, od.note,
  od.created_at as createdAt, od.created_by as createdBy, od.updated_at as updatedAt, od.updated_by as updatedBy,
  us.name as userName,
  od.address_id as addressId, ad.customer_name as customerName, ad.phone as customerPhone, ad.location
  FROM graduate.order od
  JOIN graduate.order_detail odd ON odd.order_id = od.id
  JOIN graduate.user us ON us.id = od.user_id
  JOIN graduate.address ad ON ad.id = od.address_id
  WHERE true `

  if (userId) {
    queryString += ` and od.user_id = '${userId}' `
  }

  if (storeId) {
    queryString += ` and odd.store_id = '${storeId}' `
  }

  if (status) {
    queryString += ` and od.status = '${status}' `
  }

  queryString += ` group by od.id order by od.created_at desc`

  const data = await Sequelize.query(queryString, {
    type: Sequelize.QueryTypes.SELECT,
  })

  if (data && data.length) {
    for (let order of data) {
      let sql = `SELECT odd.product_id, odd.quantity, odd.price, odd.store_id 
      FROM graduate.order_detail odd
      WHERE odd.order_id = '${order.id}'`

      if (storeId) {
        sql += ` and odd.store_id = '${storeId}' `
      }

      const dataOrderDetail = await Sequelize.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
      })

      totalPrice = dataOrderDetail.reduce((total, element) => {
        return total + element.price * element.quantity
      }, 0)

      order.products = dataOrderDetail
      order.totalPrice = totalPrice
    }
  }

  res.total = data.length
  res.products = data.slice(offset, offset + size)
  return res
}

const updateOrder = async (id, addressId, status, userId, userRole) => {
  let res = {}
  let tran = await Sequelize.transaction()
  try {
    const orderExist = await OrderModel.findOne({
      where: { id },
      transaction: tran,
    })
    if (!orderExist) {
      return MESSAGE_THROW_ERROR.ORDER_NOT_FOUND
    }

    //check order status
    if (
      orderExist.status in
      [CONFIG_ORDER_STATUS.CANCEL, CONFIG_ORDER_STATUS.FINISHED] ||
      (orderExist.status === CONFIG_ORDER_STATUS.PROCESSING &&
        userRole === USER_ROLE.CUSTOMER)
    ) {
      return MESSAGE_THROW_ERROR.ORDER_DO_NOT_HANDLE
    }

    const data = await OrderModel.update(
      {
        addressId,
        status,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      { where: { id }, transaction: tran }
    )

    if (status === 0) {
      await OrderDetailModel.destroy({
        where: { orderId: id },
        transaction: tran,
      })
    }

    res.data = data
    await tran.commit()
    return res
  } catch (error) {
    await tran.rollback()
    throw new APIError(error, httpStatus.BAD_REQUEST)
  }
}

export default {
  createOrder,
  getDetailOrder,
  getListOrder,
  updateOrder,
}
