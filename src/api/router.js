import { Router } from 'express'
import httpStatus from 'http-status'
import user from './user/router'

const router = Router()
router.use(user)
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
