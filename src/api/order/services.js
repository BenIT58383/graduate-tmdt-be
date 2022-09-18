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
import LogsModel from '../../sequelize/models/logs'
import config from '../../common/config'
import dayjs from 'dayjs'

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
        createdAt: new Date()
      },
      { transaction: tran }
    )

    //create logs
    // await LogsModel.create({ orderId: data.id }, { transaction: tran })

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
          createdAt: new Date()
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

const createOrderV1 = async (body, createdBy) => {
  let tran = await Sequelize.transaction()
  try {
    const res = {}

    for (let order of body.orders) {

      if (!order.products || order.products.length == 0) {
        await tran.rollback()
        return MESSAGE_THROW_ERROR.PRODUCT_NOT_EMPTY
      }

      //create order
      const data = await OrderModel.create(
        {
          userId: body.userId,
          addressId: order.addressId,
          status: CONFIG_ORDER_STATUS.NEW,
          note: order.note,
          createdBy: createdBy,
          createdAt: new Date()
        },
        { transaction: tran }
      )

      //create logs
      // await LogsModel.create({ orderId: data.id }, { transaction: tran })

      //handle products
      for (let product of order.products) {
        const productExist = await ProductModel.findOne({
          where: { id: product.id },
          transaction: tran,
        })

        //check exist product
        if (!productExist) {
          await tran.rollback()
          return MESSAGE_THROW_ERROR.PRODUCT_NOTFOUND
        }

        //check validate
        if (productExist.quantity < product.quantity) {
          await tran.rollback()
          return MESSAGE_THROW_ERROR.QUANTITY_PRODUCT_AND_ORDER
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
            createdAt: new Date()
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

    }

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
    `SELECT odd.product_id, odd.quantity, odd.price, odd.store_id, 
     pd.name, pd.image1, pd.image2, pd.image3, pd.image4, pd.image5,
     st.image1 as image_store, st.name as name_store
     FROM graduate.order_detail odd
     JOIN graduate.product pd ON pd.id = odd.product_id
     JOIN graduate.store st ON st.id = odd.store_id
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
  us1.name as userName, us.phone as phone_store,
  od.address_id as addressId, ad.customer_name as customerName, ad.phone as customerPhone, ad.location
  FROM graduate.order od 
  JOIN graduate.order_detail odd ON odd.order_id = od.id
  JOIN graduate.store st ON st.id = odd.store_id
  JOIN graduate.user us ON us.id = st.user_id
  JOIN graduate.user us1 ON us1.id = od.user_id
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
  data[0].store_id = dataOrderDetail[0].store_id
  data[0].image_store = dataOrderDetail[0].image_store
  data[0].name_store = dataOrderDetail[0].name_store
  data[0].createdAt = dayjs(data[0].createdAt).format('DD/MM/YYYY HH:mm:ss')
  data[0].updatedAt = dayjs(data[0].updatedAt).format('DD/MM/YYYY HH:mm:ss')

  res.order = data[0]
  return res
}

const getListOrder = async (page, size, userId, storeId, status) => {
  let res = {}
  let offset = (page - 1) * size
  let totalPrice = 0

  let queryOrder = `SELECT od.id, od.code, od.user_id as userId, od.status, od.note,
  od.created_at as createdAt, od.created_by as createdBy, od.updated_at as updatedAt, od.updated_by as updatedBy,
  us.name as userName,
  od.address_id as addressId, ad.customer_name as customerName, ad.phone as customerPhone, ad.location
  FROM graduate.order od
  JOIN graduate.order_detail odd ON odd.order_id = od.id
  JOIN graduate.user us ON us.id = od.user_id
  JOIN graduate.address ad ON ad.id = od.address_id
  WHERE true `

  if (userId) {
    queryOrder += ` and od.user_id = '${userId}' `
  }

  if (storeId) {
    queryOrder += ` and odd.store_id = '${storeId}' `
  }

  if (status) {
    queryOrder += ` and od.status = '${status}' `
  }

  queryOrder += ` group by od.id order by od.updated_at desc`

  const data = await Sequelize.query(queryOrder, {
    type: Sequelize.QueryTypes.SELECT,
  })

  if (data && data.length) {
    for (let order of data) {
      let sql = `SELECT odd.product_id, odd.quantity, odd.price, odd.store_id, 
      pd.name, pd.image1, pd.image2, pd.image3, pd.image4, pd.image5, st.image1 as image_store, st.name as name_store
      FROM graduate.order_detail odd
      JOIN graduate.product pd ON pd.id = odd.product_id
      JOIN graduate.store st ON st.id = odd.store_id
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
      order.store_id = dataOrderDetail[0].store_id
      order.image_store = dataOrderDetail[0].image_store
      order.name_store = dataOrderDetail[0].name_store
    }
  }

  //handle data
  if (data && data.length > 0) {
    for (let item of data) {
      item.createdAt = dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss')
      item.updatedAt = dayjs(item.updatedAt).format('DD/MM/YYYY HH:mm:ss')
    }
  }

  res.total = data.length
  res.orders = data.slice(offset, offset + size)
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

    //create logs
    // await LogsModel.create({ orderId: id }, { transaction: tran })

    //check order status
    if (
      orderExist.status == CONFIG_ORDER_STATUS.CANCEL || orderExist.status == CONFIG_ORDER_STATUS.FINISHED
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

    // if (status === 0) {
    //   await OrderDetailModel.destroy({
    //     where: { orderId: id },
    //     transaction: tran,
    //   })
    // }

    res.data = data
    await tran.commit()
    return res
  } catch (error) {
    await tran.rollback()
    throw new APIError(error, httpStatus.BAD_REQUEST)
  }
}

const getTotalOrder = async (userId, storeId) => {

  let queryOrder = `SELECT count(DISTINCT od.id) as total
    FROM graduate.order_detail odd
    JOIN graduate.order od on od.id = odd.order_id 
    JOIN graduate.user us ON us.id = od.user_id
    JOIN graduate.address ad ON ad.id = od.address_id
    where true`

  let sqlCancelOrder = queryOrder
  let sqlNewOrder = queryOrder
  let sqlProcessingOrder = queryOrder
  let sqlFinishOrder = queryOrder

  if (userId) {
    sqlCancelOrder += ` and od.user_id = '${userId}' and od.status = 0`
    sqlNewOrder += ` and od.user_id = '${userId}' and od.status = 1`
    sqlProcessingOrder += ` and od.user_id = '${userId}' and od.status = 2`
    sqlFinishOrder += ` and od.user_id = '${userId}' and od.status = 3`
  }

  if (storeId) {
    sqlCancelOrder += ` and odd.store_id = '${storeId}' and od.status = 0`
    sqlNewOrder += ` and odd.store_id = '${storeId}' and od.status = 1`
    sqlProcessingOrder += ` and odd.store_id = '${storeId}' and od.status = 2`
    sqlFinishOrder += ` and odd.store_id = '${storeId}' and od.status = 3`
  }

  const dataCancelOrder = await Sequelize.query(sqlCancelOrder, {
    type: Sequelize.QueryTypes.SELECT,
  })

  const dataNewOrder = await Sequelize.query(sqlNewOrder, {
    type: Sequelize.QueryTypes.SELECT,
  })

  const dataProcessingOrder = await Sequelize.query(sqlProcessingOrder, {
    type: Sequelize.QueryTypes.SELECT,
  })

  const dataFinishOrder = await Sequelize.query(sqlFinishOrder, {
    type: Sequelize.QueryTypes.SELECT,
  })

  let result = {}

  result.cancelOrder = dataCancelOrder[0].total
  result.newOrder = dataNewOrder[0].total
  result.processingOrder = dataProcessingOrder[0].total
  result.finishOrder = dataFinishOrder[0].total

  return result
}

export default {
  createOrder,
  createOrderV1,
  getDetailOrder,
  getListOrder,
  updateOrder,
  getTotalOrder,
}
