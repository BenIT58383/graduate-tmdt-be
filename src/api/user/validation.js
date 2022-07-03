import Joi from 'joi'

const createCheckTransactionStatus = {
  body: {
    request_id: Joi.string().trim(),
    reference_id: Joi.string().trim(),
    transaction_type: Joi.number(),
    amount: Joi.number(),
  },
}

const getListUsers = {
  query: {
    page: Joi.number()
      .integer()
      .allow('', null)
      .empty(['', null])
      .positive()
      .min(0)
      .default(1),
    size: Joi.number()
      .integer()
      .allow('', null)
      .empty(['', null])
      .positive()
      .default(10),
  },
}

const getListAddress = {
  query: {
    page: Joi.number()
      .integer()
      .allow('', null)
      .empty(['', null])
      .positive()
      .min(0)
      .default(1),
    size: Joi.number()
      .integer()
      .allow('', null)
      .empty(['', null])
      .positive()
      .default(10),
  },
}

export default {
  createCheckTransactionStatus,
  getListUsers,
  getListAddress,
}
