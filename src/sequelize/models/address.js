/* jshint indent: 2 */

import sequelize from 'sequelize'
import { masterDb as sequelizeInstance } from '..'
import { ORDER_CODE_LENGTH } from '../../common/constant'

const Address = sequelizeInstance.define(
  'address',
  {
    id: {
      type: sequelize.UUIDV4(36),
      defaultValue: sequelize.UUIDV4(),
      allowNull: false,
      primaryKey: true,
      field: 'id',
    },
    userId: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'user_id',
    },
    storeId: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'store_id',
    },
    userName: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'user_name',
    },
    phone: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'phone',
    },
    location: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'location',
    },
    default: {
      type: sequelize.TINYINT(1),
      allowNull: true,
      field: 'default',
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
    tableName: 'address',
  }
)
export default Address