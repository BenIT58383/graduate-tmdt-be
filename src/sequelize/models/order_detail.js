/* jshint indent: 2 */

import sequelize from 'sequelize'
import { masterDb as sequelizeInstance } from '..'
import { ORDER_CODE_LENGTH } from '../../common/constant'

const OrderDetail = sequelizeInstance.define(
  'order_detail',
  {
    id: {
      type: sequelize.UUIDV4(36),
      defaultValue: sequelize.UUIDV4(),
      allowNull: false,
      primaryKey: true,
      field: 'id',
    },
    orderId: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'order_id',
    },
    storeId: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'store_id',
    },
    productId: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'product_id',
    },
    quantity: {
      type: sequelize.FLOAT(),
      allowNull: true,
      field: 'quantity',
    },
    price: {
      type: sequelize.FLOAT(),
      allowNull: true,
      field: 'price',
    },
    createdAt: {
      type: sequelize.TIME(),
      allowNull: true,
      field: 'created_at',
    },
    createdBy: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'created_by',
    },
    updatedAt: {
      type: sequelize.TIME(),
      allowNull: true,
      field: 'updated_at',
    },
    updatedBy: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'updated_by',
    },
  },
  {
    tableName: 'order_detail',
  }
)
export default OrderDetail
