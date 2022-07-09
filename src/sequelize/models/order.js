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
    code: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'code',
    },
    userId: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'user_id',
    },
    addressId: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'address_id',
    },
    status: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'status',
    },
    note: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'note',
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
    tableName: 'order',
  }
)
export default Order
