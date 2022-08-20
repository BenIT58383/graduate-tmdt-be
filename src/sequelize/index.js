import Sequelize from 'sequelize'
import config from '../common/config/index.js'

const masterDb = new Sequelize(null, null, null, {
  dialect: 'mysql',
  dialect: 'mysql',
  host: '127.0.0.1',
  port: '3306',
  username: 'ben',
  password: '123456',
  database: 'graduate',
  define: {
    underscored: false,
    freezeTableName: true,
    charset: 'utf8mb4',
    dialectOptions: {
      collate: 'utf8mb4_general_ci',
      connectTimeout: 60000,
    },
    timestamps: false,
  },
  logging: true, // console.log
  // timezone: config.AURORA_TIMEZONE,
  dialectOptions: {},
})
// eslint-disable-next-line import/prefer-default-export
export { masterDb }
