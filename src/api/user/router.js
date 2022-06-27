import Router from 'express'
import controller from './controller'
import validate from 'express-validation'
import validateContentType from '../../express/middleware/validateContentType'
import validation from './validation'

const router = Router()

/**
 * @swagger
 * /register:
 *   post:
 *     description: register
 *     tags:
 *     - User
 *     requestBody:
 *       description: update user
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                phone:
 *                  type: string
 *                  in: body
 *                password:
 *                  type: string
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: register
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/addresses'
 */
router.route('/register').post(validateContentType, controller.register)

/**
 * @swagger
 * /login:
 *   post:
 *     description: create phone
 *     tags:
 *     - User
 *     requestBody:
 *       description: update user
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                phone:
 *                  type: string
 *                  in: body
 *                password:
 *                  type: string
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: create phone
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/addresses'
 */
router.route('/login').post(validateContentType, controller.login)

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     description: register
 *     tags:
 *     - User
 *     requestBody:
 *       description: update user
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                refreshTokenAuth:
 *                  type: string
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: register
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/addresses'
 */
router
  .route('/refresh-token')
  .post(validateContentType, controller.createNewToken)

/**
 * @swagger
 * /users:
 *   post:
 *     description: create phone
 *     tags:
 *     - User
 *     requestBody:
 *       description: update user
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *                  in: body
 *                phone:
 *                  type: string
 *                  in: body
 *                password:
 *                  type: string
 *                  in: body
 *                fsIdCard:
 *                  type: string
 *                  in: body
 *                bsIdCard:
 *                  type: string
 *                  in: body
 *                avatar:
 *                  type: string
 *                  in: body
 *                fullName:
 *                  type: string
 *                  in: body
 *                birthDay:
 *                  type: string
 *                  in: body
 *                idCardNo:
 *                  type: string
 *                  in: body
 *                job:
 *                  type: string
 *                  in: body
 *                address:
 *                  type: string
 *                  in: body
 *                salary:
 *                  type: number
 *                  in: body
 *                education:
 *                  type: string
 *                  in: body
 *                marriage:
 *                  type: number
 *                  in: body
 *                bankNo:
 *                  type: string
 *                  in: body
 *                bankName:
 *                  type: string
 *                  in: body
 *                cardHolder:
 *                  type: string
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: create phone
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/addresses'
 */
router.route('/users').post(validateContentType, controller.createUser)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     description: Get detail banner.
 *     tags:
 *     - User
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: Get list.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/banners'
 */
router.route('/users/:id').get(validateContentType, controller.getDetailUser)

/**
 * @swagger
 * /users:
 *   get:
 *     description: Get list banner.
 *     tags:
 *     - User
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: number
 *       - name: size
 *         in: query
 *         schema:
 *           type: number
 *       - name: code
 *         in: query
 *         schema:
 *           type: string
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *       - name: phone
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: Get list.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/banners'
 */
router
  .route('/users')
  .get(
    validateContentType,
    validate(validation.getListUsers),
    controller.getListUsers
  )

/**
 * @swagger
 * /users/{phone}:
 *   put:
 *     description: update user
 *     tags:
 *     - User
 *     parameters:
 *      - name: phone
 *        in: path
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       description: update user
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *                  in: body
 *                password:
 *                  type: string
 *                  in: body
 *                fsIdCard:
 *                  type: string
 *                  in: body
 *                bsIdCard:
 *                  type: string
 *                  in: body
 *                avatar:
 *                  type: string
 *                  in: body
 *                fullName:
 *                  type: string
 *                  in: body
 *                birthDay:
 *                  type: string
 *                  in: body
 *                idCardNo:
 *                  type: string
 *                  in: body
 *                job:
 *                  type: string
 *                  in: body
 *                address:
 *                  type: string
 *                  in: body
 *                salary:
 *                  type: number
 *                  in: body
 *                education:
 *                  type: string
 *                  in: body
 *                marriage:
 *                  type: number
 *                  in: body
 *                bankNo:
 *                  type: string
 *                  in: body
 *                bankName:
 *                  type: string
 *                  in: body
 *                cardHolder:
 *                  type: string
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: address info.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/addresses'
 */
router.route('/users/:phone').put(validateContentType, controller.updateUser)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     description: delete user
 *     tags:
 *     - User
 *     parameters:
 *      - name: id
 *        in: path
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: delete user.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/addresses'
 */
router.route('/users/:id').delete(validateContentType, controller.deleteUser)

export default router
