/* jshint indent: 2 */

import sequelize from 'sequelize'
import { masterDb as sequelizeInstance } from '..'
import { ORDER_CODE_LENGTH } from '../../common/constant'

const Store = sequelizeInstance.define(
  'store',
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
    name: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'name',
    },
    image1: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'image1',
    },
    image2: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'image2',
    },
    image3: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'image3',
    },
    isActive: {
      type: sequelize.INTEGER(),
      allowNull: true,
      field: 'is_active',
    },
    description: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'description',
    },
    linkSupport: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'link_support',
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
    tableName: 'store',
  }
)
export default Store
