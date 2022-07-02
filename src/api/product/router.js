import Router from 'express'
import controller from './controller'
import validate from 'express-validation'
import validateContentType from '../../express/middleware/validateContentType'
import validation from './validation'

const router = Router()

/**
 * @swagger
 * /stores/products:
 *   post:
 *     description: create product
 *     tags:
 *     - Product
 *     requestBody:
 *       description: create product
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                storeId:
 *                  type: string
 *                  in: body
 *                categoryId:
 *                  type: string
 *                  in: body
 *                unitId:
 *                  type: number
 *                  in: body
 *                code:
 *                  type: string
 *                  in: body
 *                amount:
 *                  type: number
 *                  in: body
 *                price:
 *                  type: number
 *                  in: body
 *                name:
 *                  type: string
 *                  in: body
 *                image:
 *                  type: string
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: create product
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router
  .route('/stores/products')
  .post(validateContentType, controller.createProduct)

/**
 * @swagger
 * /stores/products/{id}:
 *   get:
 *     description: Get detail product.
 *     tags:
 *     - Product
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
  .route('/stores/products/:id')
  .get(validateContentType, controller.getDetailProduct)

/**
 * @swagger
 * /stores/products:
 *   get:
 *     description: Get list product.
 *     tags:
 *     - Product
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: number
 *       - name: size
 *         in: query
 *         schema:
 *           type: number
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *       - name: categoryId
 *         in: query
 *         schema:
 *           type: string
 *       - name: storeId
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
  .route('/stores/products')
  .get(
    validateContentType,
    validate(validation.getListProduct),
    controller.getListProduct
  )

/**
 * @swagger
 * /stores/products/{id}:
 *   put:
 *     description: update product
 *     tags:
 *     - Product
 *     parameters:
 *      - name: id
 *        in: path
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       description: update product
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                storeId:
 *                  type: string
 *                  in: body
 *                categoryId:
 *                  type: string
 *                  in: body
 *                unitId:
 *                  type: number
 *                  in: body
 *                code:
 *                  type: string
 *                  in: body
 *                amount:
 *                  type: number
 *                  in: body
 *                price:
 *                  type: number
 *                  in: body
 *                name:
 *                  type: string
 *                  in: body
 *                image:
 *                  type: string
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: update product
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router
  .route('/stores/products/:id')
  .put(validateContentType, controller.updateProduct)

/**
 * @swagger
 * /stores/products/{id}:
 *   delete:
 *     description: update product
 *     tags:
 *     - Product
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
 *         description: update product
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router
  .route('/stores/products/:id')
  .delete(validateContentType, controller.deleteProduct)

export default router