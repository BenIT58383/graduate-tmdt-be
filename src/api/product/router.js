import Router from 'express'
import controller from './controller'
import validate from 'express-validation'
import validateContentType from '../../express/middleware/validateContentType'
import validation from './validation'

const router = Router()

export default router
