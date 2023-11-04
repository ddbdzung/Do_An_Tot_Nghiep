const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const sinhVienValidation = require('../../validations/sinhVien.validation');
const sinhVienController = require('../../controllers/sinhVien.controller');
const { permission } = require('../../config/permission');

const router = express.Router();

router
  .route('/')
  .post(auth(permission.SINHVIEN.MANAGE_SINHVIEN), validate(sinhVienValidation.createSinhVien), sinhVienController.createSinhVien)
  .get(auth(permission.SINHVIEN.GET_SINHVIEN), validate(sinhVienValidation.getSinhViens), sinhVienController.getSinhViens);

router
  .route('/:sinhVienId')
  .get(auth(permission.SINHVIEN.GET_SINHVIEN), validate(sinhVienValidation.getSinhVien), sinhVienController.getSinhVien)
  .patch(auth(permission.SINHVIEN.MANAGE_SINHVIEN), validate(sinhVienValidation.updateSinhVien), sinhVienController.updateSinhVien)
  .delete(auth(permission.SINHVIEN.DELETE_SINHVIEN), validate(sinhVienValidation.deleteSinhVien), sinhVienController.deleteSinhVien);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: SinhViens
 *   description: SinhVien management and retrieval
 */

/**
 * @swagger
 * /sinhViens:
 *   post:
 *     summary: Create a sinhVien
 *     description: Login user can create sinhViens.
 *     tags: [SinhViens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - HoTen
 *               - Sdt
 *             properties:
 *               HoTen:
 *                 type: string
 *                 description: write description, please
 *               Sdt:
 *                 type: string
 *                 description: write description, please
 *             example:
 *               HoTen: HoTen
 *               Sdt: Sdt
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SinhVien'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all sinhViens
 *     description: Login user can retrieve all sinhViens.
 *     tags: [SinhViens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of sinhViens
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SinhVien'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /sinhViens/{id}:
 *   get:
 *     summary: Get a sinhVien
 *     description: Logged in users can fetch only their own sinhVien information. Only admins can fetch other sinhViens.
 *     tags: [SinhViens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SinhVien id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SinhVien'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a sinhVien
 *     description: Logged in sinhViens can only update their own information. Only admins can update other sinhViens.
 *     tags: [SinhViens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SinhVien id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HoTen:
 *                 type: string
 *                 description: write description, please
 *               Sdt:
 *                 type: string
 *                 description: write description, please
 *             example:
 *               HoTen: HoTen
 *               Sdt: Sdt
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SinhVien'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a sinhVien
 *     description: Logged in sinhViens can delete only themselves. Only admins can delete other sinhViens.
 *     tags: [SinhViens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SinhVien id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
