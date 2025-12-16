const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const { getBalance } = require('../controllers/balanceController');
/**
 * @swagger
 * /api/balance:
 *   get:
 *     tags: [2. Module Transaction]
 *     summary: Get user balance
 *     description: |
 *       **API Balance Private (memerlukan Token untuk mengaksesnya)**
 *       
 *       Digunakan untuk mendapatkan informasi balance / saldo terakhir dari User
 *       
 *       Ketentuan :
 *       - Service ini harus menggunakan Bearer Token JWT untuk mengaksesnya
 *       - Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login
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
 *                   example: "Get Balance Berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: integer
 *                       example: 1000000
 *                   required:
 *                     - balance
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
router.get('/balance', authMiddleware, getBalance);

module.exports = router;
