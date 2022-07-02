/* jshint indent: 2 */

import sequelize from 'sequelize'
import { masterDb as sequelizeInstance } from '..'
import { ORDER_CODE_LENGTH } from '../../common/constant'

const Order = sequelizeInstance.define(
  'order',
  {
    id: {
      type: sequelize.UUIDV4(36),
      defaultValue: sequelize.UUIDV4(),
      allowNull: false,
      primaryKey: true,
      field: 'id',
    },
    storeId: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'store_id',
    },
    categoryId: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'category_id',
    },
    unitId: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'unit_id',
    },
    amount: {
      type: sequelize.FLOAT(),
      allowNull: true,
      field: 'amount',
    },
    price: {
      type: sequelize.FLOAT(),
      allowNull: true,
      field: 'price',
    },
    name: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'name',
    },
    image: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'status',
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
    tableName: 'order',
  }
)
export default Order
