import Router from 'express'
import controller from './controller'
import validate from 'express-validation'
import validateContentType from '../../express/middleware/validateContentType'
import validation from './validation'
const { uploadImage } = require("../../express/middleware/upload-img");

const router = Router()

/**
 * @swagger
 * /stores:
 *   post:
 *     description: create store
 *     tags:
 *     - Store
 *     requestBody:
 *       description: create store
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: string
 *                  in: body
 *                name:
 *                  type: string
 *                  in: body
 *                image1:
 *                  type: string
 *                  in: body
 *                image2:
 *                  type: string
 *                  in: body
 *                image3:
 *                  type: string
 *                  in: body
 *                description:
 *                  type: string
 *                  in: body
 *                linkSupport:
 *                  type: string
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: create store
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router.route('/stores').post(uploadImage("images", "array"), controller.createStore)

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     description: Get detail store.
 *     tags:
 *     - Store
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
router.route('/stores/:id').get(validateContentType, controller.getDetailStore)

/**
 * @swagger
 * /stores:
 *   get:
 *     description: Get list product.
 *     tags:
 *     - Store
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
 *       - name: userId
 *         in: query
 *         schema:
 *           type: string
 *       - name: isActive
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
  .route('/stores')
  .get(
    validateContentType,
    validate(validation.getListStore),
    controller.getListStore
  )

/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     description: update store
 *     tags:
 *     - Store
 *     parameters:
 *      - name: id
 *        in: path
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       description: update store
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: string
 *                  in: body
 *                name:
 *                  type: string
 *                  in: body
 *                image1:
 *                  type: string
 *                  in: body
 *                image2:
 *                  type: string
 *                  in: body
 *                image3:
 *                  type: string
 *                  in: body
 *                description:
 *                  type: string
 *                  in: body
 *                linkSupport:
 *                  type: string
 *                  in: body
 *                isActive:
 *                  type: number
 *                  in: body
 *     responses:
 *       allOf:
 *         - $ref: '#/components/responses/CommonChartErrorResponse'
 *       200:
 *         description: update store
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router.route('/stores/:id').put(validateContentType, controller.updateStore)

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     description: update store
 *     tags:
 *     - Store
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
 *         description: update store
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/user'
 */
router.route('/stores/:id').delete(validateContentType, controller.deleteStore)

export default router
