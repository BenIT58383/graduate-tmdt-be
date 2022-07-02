/* jshint indent: 2 */

import sequelize from 'sequelize'
import { masterDb as sequelizeInstance } from '..'
import { ORDER_CODE_LENGTH } from '../../common/constant'

const User = sequelizeInstance.define(
  'user',
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
    phone: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'phone',
    },
    password: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'password',
    },
    role: {
      type: sequelize.TINYINT(1),
      allowNull: true,
      field: 'role',
    },
    refreshToken: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'refresh_token',
    },
    avatar: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'avatar',
    },
    fullName: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'full_name',
    },
    dateOfBirth: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'date_of_birth',
    },
    createdAt: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'created_at',
    },
    updatedAt: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'updated_at',
    },
  },
  {
    tableName: 'user',
  }
)
export default User
