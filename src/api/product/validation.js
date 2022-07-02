import Joi from 'joi'

const getListProduct = {
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

const getListCategory = {
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

export default { getListProduct, getListCategory }
