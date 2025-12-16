const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const { getServices } = require('../controllers/serviceController');

/**
 * @swagger
 * /api/services:
 *   get:
 *     tags: [3. Module Information]
 *     summary: Get list of services
 *     description: |
 *       **API Services Private (memerlukan Token untuk mengaksesnya)**
 *       
 *       Digunakan untuk mendapatkan list Service/Layanan PPOB
 *       
 *       Ketentuan :
 *       - Buat data list Service/Layanan sesuai dokumentasi Response dibawah, usahakan data list Service atau Layanan ini tidak di hardcode, melainkan ambil dari database
 *       - Tidak perlu membuatkan module CRUD Service/Layanan
 *       - Handling Response sesuai dokumentasi Response dibawah
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       service_code:
 *                         type: string
 *                         example: "PAJAK"
 *                       service_name:
 *                         type: string
 *                         example: "Pajak PBB"
 *                       service_icon:
 *                         type: string
 *                         format: uri
 *                         example: "https://nutech-integrasi.app/dummy.jpg"
 *                       service_tariff:
 *                         type: integer
 *                         example: 40000
 *                     required:
 *                       - service_code
 *                       - service_name
 *                       - service_icon
 *                       - service_tariff
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
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 */
router.get('/services', authMiddleware, getServices);

module.exports = router;
