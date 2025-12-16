const express = require('express');
const router = express.Router();
const { getBanners } = require('../controllers/bannerController');

/**
 * @swagger
 * /api/banner:
 *   get:
 *     tags: [3. Module Information]
 *     summary: Get list of banners
 *     description: |
 *       **API Banner Public (tidak memerlukan Token untuk mengaksesnya)**
 *       
 *       Digunakan untuk mendapatkan list banner
 *       
 *       Ketentuan :
 *       - Buat data list banner sesuai dokumentasi Response dibawah, usahakan banner ini tidak di hardcode, melainkan ambil dari database
 *       - Tidak perlu membuatkan module CRUD banner
 *       - Handling Response sesuai dokumentasi Response dibawah
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       banner_name:
 *                         type: string
 *                         example: "Banner 1"
 *                       banner_image:
 *                         type: string
 *                         format: uri
 *                         example: "https://nutech-integrasi.app/dummy.jpg"
 *                       description:
 *                         type: string
 *                         example: "Lerem Ipsum Dolor sit amet"
 *                     required:
 *                       - banner_name
 *                       - banner_image
 *                       - description
 */
router.get('/banner', getBanners);

module.exports = router;
