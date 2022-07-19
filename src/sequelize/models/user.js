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
    refreshToken: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'refresh_token',
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
    email: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'email',
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
    avatar: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'avatar',
    },
    name: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'name',
    },
    dateOfBirth: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'date_of_birth',
    },
    status: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'status',
    },
    isOnline: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'is_online',
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
