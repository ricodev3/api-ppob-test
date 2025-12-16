const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const { getProfile, updateProfile,updateProfileImage } = require('../controllers/profileController');
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 108
 *         message:
 *           type: string
 *           example: "Token tidak tidak valid atau kadaluwarsa"
 *         data:
 *           type: object
 *           nullable: true
 *           example: null
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags: [1. Module Membership]  
 *     summary: Get user profile
 *     description: |
 *       **API Profile Private (memerlukan Token untuk mengaksesnya)**
 *       
 *       Digunakan untuk mendapatkan informasi profile User
 *       
 *       Ketentuan :
 *       - Service ini harus menggunakan Bearer Token JWT untuk mengaksesnya
 *       - Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login
 *       -  Handling Response sesuai dokumentasi Response dibawah
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Sukses"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@nutech-integrasi.com
 *                     first_name:
 *                       type: string
 *                       example: User
 *                     last_name:
 *                       type: string
 *                       example: Nutech
 *                     profile_image:
 *                       type: string
 *                       format: uri
 *                       example: https://yoururlapi.com/profile.jpeg
 *                   required:
 *                     - email
 *                     - first_name
 *                     - last_name
 *                     - profile_image
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 */
router.get('/profile', authMiddleware, getProfile);
/**
 * @swagger
 * /api/profile/update:
 *   put:
 *     tags: [1. Module Membership]
 *     summary: Update user profile
 *     description: |
 *       **API Update Profile Private (memerlukan Token untuk mengaksesnya)**
 *       
 *       Digunakan untuk mengupdate data profile User
 *       
 *       Ketentuan :
 *       - Service ini harus menggunakan Bearer Token JWT untuk mengaksesnya
 *       - Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login
 *       - Handling Response sesuai dokumentasi Response dibawah
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: User Edited
 *               last_name:
 *                 type: string
 *                 example: Nutech Edited
 *             example:
 *               first_name: User Edited
 *               last_name: Nutech Edited
 *     responses:
 *       200:
 *         description: Update success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Update Profile berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@nutech-integrasi.com
 *                     first_name:
 *                       type: string
 *                       example: User Edited
 *                     last_name:
 *                       type: string
 *                       example: Nutech Edited
 *                     profile_image:
 *                       type: string
 *                       format: uri
 *                       example: https://yoururlapi.com/profile.jpeg
 *                   required:
 *                     - email
 *                     - first_name
 *                     - last_name
 *                     - profile_image
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 */
router.put('/profile/update', authMiddleware, updateProfile);
/**
 * @swagger
 * /api/profile/image:
 *   put:
 *     tags: [1. Module Membership]
 *     summary: Upload profile image
 *     description: |
 *       **API Upload Profile Image Private (memerlukan Token untuk mengaksesnya)**
 *       
 *       Digunakan untuk mengupdate / upload profile image User
 *       
 *       Ketentuan :
 *       - Service ini harus menggunakan Bearer Token JWT untuk mengaksesnya
 *       - Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login
 *       - Format Image yang boleh di upload hanya jpeg dan png
 *       - Handling Response sesuai dokumentasi Response dibawah
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG or PNG format)
 *     responses:
 *       200:
 *         description: Upload success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Update Profile Image berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@nutech-integrasi.com
 *                     first_name:
 *                       type: string
 *                       example: User Edited
 *                     last_name:
 *                       type: string
 *                       example: Nutech Edited
 *                     profile_image:
 *                       type: string
 *                       format: uri
 *                       example: https://yoururlapi.com/profile-updated.jpeg
 *                   required:
 *                     - email
 *                     - first_name
 *                     - last_name
 *                     - profile_image
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: "Format Image tidak sesuai"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *             examples:
 *               unauthorizedExample:
 *                 summary: Invalid or expired token
 *                 value:
 *                   status: 108
 *                   message: "Token tidak tidak valid atau kadaluwarsa"
 *                   data: null
 */
router.put('/profile/image', authMiddleware, upload.single('file'),updateProfileImage);


module.exports = router;
