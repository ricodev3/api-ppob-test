const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const transactionController = require('../controllers/transactionController');

/**
 * @swagger
 * /api/transaction:
 *   post:
 *     tags: [2. Module Transaction]
 *     summary: Create a transaction
 *     description: |
 *       **API Transaction Private (memerlukan Token untuk mengaksesnya)**
 *       
 *       Digunakan untuk melakukan transaksi dari services / layanan yang tersedia
 *       
 *       Ketentuan :
 *       - Service ini harus menggunakan Bearer Token JWT untuk mengaksesnya
 *       - Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login
 *       - Setiap kali melakukan Transaksi harus dipastikan balance / saldo mencukupi
 *       - Pada saat Transaction set transaction_type di database menjadi PAYMENT
 *       - Handling Response sesuai dokumentasi Response dibawah
 *       - Response invoice_number untuk formatnya generate bebas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service_code
 *             properties:
 *               service_code:
 *                 type: string
 *                 example: "PULSA"
 *                 description: Service code from available services
 *           example:
 *             service_code: "PULSA"
 *     responses:
 *       200:
 *         description: Transaction success
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
 *                   example: "Transaksi berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoice_number:
 *                       type: string
 *                       example: "INV17082023-001"
 *                     service_code:
 *                       type: string
 *                       example: "PLN_PRABAYAR"
 *                     service_name:
 *                       type: string
 *                       example: "PLN Prabayar"
 *                     transaction_type:
 *                       type: string
 *                       example: "PAYMENT"
 *                     total_amount:
 *                       type: integer
 *                       example: 10000
 *                     created_on:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-08-17T10:10:10.000Z"
 *                   required:
 *                     - invoice_number
 *                     - service_code
 *                     - service_name
 *                     - transaction_type
 *                     - total_amount
 *                     - created_on
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
 *                   enum:
 *                     - "Service ataus Layanan tidak ditemukan"
 *                     - "Saldo tidak mencukupi"
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
router.post('/transaction', authMiddleware, transactionController.createTransaction);
/**
 * @swagger
 * /api/transaction/history:
 *   get:
 *     tags: [2. Module Transaction]
 *     summary: Get transaction history
 *     description: |
 *       **API History Private (memerlukan Token untuk mengaksesnya)**
 *       
 *       Digunakan untuk mendapatkan informasi history transaksi
 *       
 *       Ketentuan :
 *       - Service ini harus menggunakan Bearer Token JWT untuk mengaksesnya
 *       - Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login
 *       - Terdapat parameter limit yang bersifat opsional, jika limit tidak dikirim maka tampilkan semua data
 *       - Data di order dari yang paling baru berdasarkan transaction date (created_on)
 *       - Handling Response sesuai dokumentasi Response dibawah
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of records to skip (pagination)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of records to return (pagination), if not provided returns all records
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
 *                   example: "Get History Berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     offset:
 *                       type: integer
 *                       example: 0
 *                     limit:
 *                       type: integer
 *                       nullable: true
 *                       example: 3
 *                     records:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           invoice_number:
 *                             type: string
 *                             example: "INV17082023-001"
 *                           transaction_type:
 *                             type: string
 *                             enum: [TOPUP, PAYMENT]
 *                             example: "TOPUP"
 *                           description:
 *                             type: string
 *                             example: "Top Up balance"
 *                           total_amount:
 *                             type: integer
 *                             example: 100000
 *                           created_on:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-08-17T10:10:10.000Z"
 *                         required:
 *                           - invoice_number
 *                           - transaction_type
 *                           - description
 *                           - total_amount
 *                           - created_on
 *                   required:
 *                     - offset
 *                     - limit
 *                     - records
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
router.get('/transaction/history', authMiddleware, transactionController.getHistory);

module.exports = router;
