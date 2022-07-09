import { Router } from 'express'
import httpStatus from 'http-status'
import user from './user/router'
import product from './product/router'
import store from './store/router'
import order from './order/router'

const router = Router()
router.use(user)
router.use(product)
router.use(store)
router.use(order)
// catch 404 not found
router.use('*', (req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    error: {
      message: 'COMMON_ERR_018',
      errors: [
        {
          message: ['Server not found.'],
        },
      ],
    },
  })
})

export default router
