const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const { topupBalance } = require('../controllers/topupController');
/**
 * @swagger
 * /api/topup:
 *   post:
 *     tags: [2. Module Transaction]
 *     summary: Top up user balance
 *     description: |
 *       **API Topup Private (memerlukan Token untuk mengaksesnya)**
 *       
 *       Digunakan untuk melakukan top up balance / saldo dari User
 *       
 *       Ketentuan :
 *       - Service ini harus menggunakan Bearer Token JWT untuk mengaksesnya
 *       - Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login
 *       - Setiap kali melakukan Top Up maka balance / saldo dari User otomatis bertambah
 *       - Parameter amount hanya boleh angka saja dan tidak boleh lebih kecil dari 0
 *       - Pada saat Top Up set transaction_type di database menjadi TOPUP
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
 *               - top_up_amount
 *             properties:
 *               top_up_amount:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1000000
 *                 description: Amount to top up (must be positive number)
 *           example:
 *             top_up_amount: 1000000
 *     responses:
 *       200:
 *         description: Top up success
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
 *                   example: "Top Up Balance berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: integer
 *                       example: 2000000
 *                   required:
 *                     - balance
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
 *                   example: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0"
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
 */
router.post('/topup', authMiddleware, topupBalance);

module.exports = router;
