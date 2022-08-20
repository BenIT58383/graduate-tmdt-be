import Router from 'express'
import controller from './controller'
import validate from 'express-validation'
import validateContentType from '../../express/middleware/validateContentType'
import validation from './validation'

const router = Router()

/**
 * @swagger
 * /orders:
 *   post:
 *     description: create order
 *     tags:
 *     - Order
 *     requestBody:
 *       description: create order
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: string
 *                  in: body
 *                products:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      storeId:
 *                        type: string
 *                      quantity:
 *                        type: number
 *                      price:
 *                        type: number
 *                addressId:
 *                  type: string
 *                  in: body
 *                note:
 *                  type: string
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: create order
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router.route('/orders').post(validateContentType, controller.createOrder)

/**
 * @swagger
 * /orders-v1:
 *   post:
 *     description: create order
 *     tags:
 *     - Order
 *     requestBody:
 *       description: create order
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: string
 *                  in: body
 *                orders:
 *                  type: array
 *                  items: 
 *                    type: object
 *                    properties:
 *                      products:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                            storeId:
 *                              type: string
 *                            quantity:
 *                              type: number
 *                            price:
 *                              type: number
 *                      addressId:
 *                        type: string
 *                        in: body
 *                      note:
 *                        type: string
 *                        in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: create order
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router.route('/orders-v1').post(validateContentType, controller.createOrderV1)

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     description: Get detail order.
 *     tags:
 *     - Order
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
router.route('/orders/:id').get(validateContentType, controller.getDetailOrder)

/**
 * @swagger
 * /orders:
 *   get:
 *     description: Get list Order.
 *     tags:
 *     - Order
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
 *       - name: status
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
  .route('/orders')
  .get(
    validateContentType,
    validate(validation.getListOrder),
    controller.getListOrder
  )

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     description: update order
 *     tags:
 *     - Order
 *     parameters:
 *      - name: id
 *        in: path
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       description: update order
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                addressId:
 *                  type: string
 *                  in: body
 *                status:
 *                  type: number
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: update
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router.route('/orders/:id').put(validateContentType, controller.updateOrder)

export default router
