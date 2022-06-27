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
    type: {
      type: sequelize.TINYINT(1),
      allowNull: true,
      field: 'type',
    },
    refreshToken: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'refresh_token',
    },
    fsIdCard: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'fs_id_card',
    },
    bsIdCard: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'bs_id_card',
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
    birthDay: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'birth_day',
    },
    idCardNo: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'id_card_no',
    },
    job: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'job',
    },
    address: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'address',
    },
    salary: {
      type: sequelize.FLOAT(),
      allowNull: true,
      field: 'salary',
    },
    education: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'education',
    },
    marriage: {
      type: sequelize.TINYINT(1),
      allowNull: true,
      field: 'marriage',
    },
    bankNo: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'bank_no',
    },
    bankName: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'bank_name',
    },
    cardHolder: {
      type: sequelize.STRING(),
      allowNull: true,
      field: 'card_holder',
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
