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
    productId: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'product_id',
    },
    orderId: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'order_id',
    },
    amount: {
      type: sequelize.FLOAT(),
      allowNull: true,
      field: 'amount',
    },
    totalPrice: {
      type: sequelize.FLOAT(),
      allowNull: true,
      field: 'total_price',
    },
    createdAt: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'created_at',
    },
    createdBy: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'created_by',
    },
    updatedAt: {
      type: sequelize.STRING(),
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