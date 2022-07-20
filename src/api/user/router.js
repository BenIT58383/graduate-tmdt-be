import Router from 'express'
import controller from './controller'
import validate from 'express-validation'
import validateContentType from '../../express/middleware/validateContentType'
import validation from './validation'
const { uploadImage } = require("../../express/middleware/upload-img");

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
 *                userName:
 *                  type: string
 *                  in: body
 *                phone:
 *                  type: string
 *                  in: body
 *                email:
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
 *              $ref: '#/components/schemas/user'
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
 *                userNamePhone:
 *                  type: string
 *                  in: body
 *                email:
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
 *              $ref: '#/components/schemas/user'
 */
router.route('/login').post(validateContentType, controller.login)

/**
 * @swagger
 * /users:
 *   post:
 *     description: create phone
 *     tags:
 *     - User
 *     requestBody:
 *       description: create user
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userName:
 *                  type: string
 *                  in: body
 *                phone:
 *                  type: string
 *                  in: body
 *                email:
 *                  type: string
 *                  in: body
 *                password:
 *                  type: string
 *                  in: body
 *                role:
 *                  type: number
 *                  in: body
 *                name:
 *                  type: string
 *                  in: body
 *                dateOfBirth:
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
 *              $ref: '#/components/schemas/user'
 */
router.route('/users').post(uploadImage("usersImg", "array"), controller.createUser)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     description: Get detail user.
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
 *         description: Get detail.
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
 *     description: Get list user.
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
 *       - name: userName
 *         in: query
 *         schema:
 *           type: string
 *       - name: phone
 *         in: query
 *         schema:
 *           type: string
 *       - name: email
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
 * /users/{id}:
 *   put:
 *     description: update user
 *     tags:
 *     - User
 *     parameters:
 *      - name: id
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
 *                userName:
 *                  type: string
 *                  in: body
 *                phone:
 *                  type: string
 *                  in: body
 *                email:
 *                  type: string
 *                  in: body
 *                password:
 *                  type: string
 *                  in: body
 *                role:
 *                  type: number
 *                  in: body
 *                avatar:
 *                  type: string
 *                  in: body
 *                name:
 *                  type: string
 *                  in: body
 *                dateOfBirth:
 *                  type: string
 *                  in: body
 *                status:
 *                  type: number
 *                  in: body
 *                isOnline:
 *                  type: number
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: user info.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router.route('/users/:id').put(validateContentType, controller.updateUser)

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
 *              $ref: '#/components/schemas/user'
 */
router.route('/users/:id').delete(validateContentType, controller.deleteUser)

/**
 * @swagger
 * /addresses:
 *   post:
 *     description: create address
 *     tags:
 *     - Address
 *     requestBody:
 *       description: create address
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                storeId:
 *                  type: string
 *                  in: body
 *                customerName:
 *                  type: string
 *                  in: body
 *                phone:
 *                  type: string
 *                  in: body
 *                location:
 *                  type: string
 *                  in: body
 *                isDefault:
 *                  type: number
 *                  in: body
 *                type:
 *                  type: number
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: create address
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router.route('/addresses').post(validateContentType, controller.createAddress)

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     description: Get detail address.
 *     tags:
 *     - Address
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: Get detail.
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/banners'
 */
router
  .route('/addresses/:id')
  .get(validateContentType, controller.getDetailAddress)

/**
 * @swagger
 * /addresses:
 *   get:
 *     description: Get list address.
 *     tags:
 *     - Address
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: number
 *       - name: size
 *         in: query
 *         schema:
 *           type: number
 *       - name: userId
 *         in: query
 *         schema:
 *           type: string
 *       - name: storeId
 *         in: query
 *         schema:
 *           type: string
 *       - name: isDefault
 *         in: query
 *         schema:
 *           type: number
 *       - name: type
 *         in: query
 *         schema:
 *           type: number
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
  .route('/addresses')
  .get(
    validateContentType,
    validate(validation.getListAddress),
    controller.getListAddress
  )

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     description: update address
 *     tags:
 *     - Address
 *     parameters:
 *      - name: id
 *        in: path
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       description: update address
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                storeId:
 *                  type: string
 *                  in: body
 *                customerName:
 *                  type: string
 *                  in: body
 *                phone:
 *                  type: string
 *                  in: body
 *                location:
 *                  type: string
 *                  in: body
 *                isDefault:
 *                  type: number
 *                  in: body
 *                type:
 *                  type: number
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: update address
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router
  .route('/addresses/:id')
  .put(validateContentType, controller.updateAddress)

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     description: update address
 *     tags:
 *     - Address
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
 *         description: update address
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router
  .route('/addresses/:id')
  .delete(validateContentType, controller.deleteAddress)

export default router
