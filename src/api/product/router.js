import Router from 'express'
import controller from './controller'
import validate from 'express-validation'
import validateContentType from '../../express/middleware/validateContentType'
import validation from './validation'
const { uploadImage } = require("../../express/middleware/upload-img");

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
 *                  type: string
 *                  in: body
 *                quantity:
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
 *                description:
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
  .post(validateContentType, uploadImage("productsImg", "array"), controller.createProduct)

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
 *       - name: description
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
 *                description:
 *                  type: string
 *                  in: body
 *                status:
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

/**
 * @swagger
 * /categories:
 *   post:
 *     description: create category
 *     tags:
 *     - Category
 *     requestBody:
 *       description: create category
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
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
router.route('/categories').post(validateContentType, controller.createCategory)

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     description: Get detail category.
 *     tags:
 *     - Category
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
  .route('/categories/:id')
  .get(validateContentType, controller.getDetailCategory)

/**
 * @swagger
 * /categories:
 *   get:
 *     description: Get list category.
 *     tags:
 *     - Category
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
  .route('/categories')
  .get(
    validateContentType,
    validate(validation.getListCategory),
    controller.getListCategory
  )

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     description: update category
 *     tags:
 *     - Category
 *     parameters:
 *      - name: id
 *        in: path
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       description: update category
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
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
  .route('/categories/:id')
  .put(validateContentType, controller.updateCategory)

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     description: update category
 *     tags:
 *     - Category
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
  .route('/categories/:id')
  .delete(validateContentType, controller.deleteCategory)

/**
 * @swagger
 * /units:
 *   post:
 *     description: create units
 *     tags:
 *     - Unit
 *     requestBody:
 *       description: create units
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  in: body
 *                description:
 *                  type: string
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: create units
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router.route('/units').post(validateContentType, controller.createUnit)

/**
 * @swagger
 * /units:
 *   get:
 *     description: Get list unit.
 *     tags:
 *     - Unit
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
 *       - name: description
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
  .route('/units')
  .get(
    validateContentType,
    validate(validation.getListUnit),
    controller.getListUnit
  )

/**
 * @swagger
 * /units/{id}:
 *   delete:
 *     description: update unit
 *     tags:
 *     - Unit
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
 *         description: update unit
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router.route('/units/:id').delete(validateContentType, controller.deleteUnit)

export default router
