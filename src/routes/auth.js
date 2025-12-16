const router = require('express').Router();
const controller = require('../controllers/authController');

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [1. Module Membership]
 *     summary: Register user
 *     description: |
 *       **API Registration Public (Tidak perlu Token untuk mengaksesnya)**
 *       
 *       Digunakan untuk melakukan registrasi User agar bisa Login kedalam aplikasi
 *       
 *       Ketentuan :
 *       - Parameter request email harus terdapat validasi format email
 *       - Parameter request password Length minimal 8 karakter
 *       - Handling Response sesuai dokumentasi Response dibawah
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@nutech-integrasi.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: abcdef1234
 *               first_name:
 *                 type: string
 *                 example: User
 *               last_name:
 *                 type: string
 *                 example: Nutech
 *             example:
 *               email: user@nutech-integrasi.com
 *               first_name: User
 *               last_name: Nutech
 *               password: abcdef1234
 *     responses:
 *       200:
 *         description: Register success
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
 *                   example: "Registrasi berhasil silahkan login"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   enum: [102, 103, 104]
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Paramter email tidak sesuai format"
 *                     - "Password minimal 8 karakter"
 *                     - "Email sudah terdaftar"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 */
router.post('/register', controller.register);
/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [1. Module Membership]
 *     summary: Login user
 *     description: |
 *       **API Login Public (Tidak perlu Token untuk mengaksesnya)**
 *       
 *       Digunakan untuk melakukan login dan mendapatkan authentication berupa JWT (Json Web Token)
 *       
 *       Ketentuan :
 *       - Parameter request email harus terdapat validasi format email
 *       - Parameter request password Length minimal 8 karakter
 *       - JWT yang digenerate harus memuat payload email dan di set expiration selama 12 jam dari waktu di generate
 *       - Handling Response sesuai dokumentasi Response dibawah
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@nutech-integrasi.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: abcdef1234
 *           example:
 *             email: user@nutech-integrasi.com
 *             password: abcdef1234
 *     responses:
 *       200:
 *         description: Login success
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
 *                   example: "Login Sukses"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNTRVdXRjYTdCS0ZPX0ZUZGZ1bXlJem9zSTRKa1VxUGZVZ0ROSTUwelRTQlo2aHoyY0hKZ1VMb1loM09HUUd0ekQxV3dTX194aHBNZTE2SGFscVRzcEhjS21UclJ3S2FYYmZob3AzdzFFUHJ2NFdBQmk1c0RpdV9DSnZTSWt2MDFTbEU0QU5pbVB0bUx5azZoUzlOalVQNEZaVVpfRVBtcEk4Y3pNc3ZWa2JFPSIsImlhdCI6MTYyNjkyODk3MSwiZXhwIjoyNTU2MTE4Nzk4fQ.9C9NvhZYKivhGWnrjo4Wr1Rv-wur1wCm0jqfK9XDD8U"
 *             examples:
 *               successExample:
 *                 summary: Login success
 *                 value:
 *                   status: 0
 *                   message: "Login Sukses"
 *                   data:
 *                     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNTRVdXRjYTdCS0ZPX0ZUZGZ1bXlJem9zSTRKa1VxUGZVZ0ROSTUwelRTQlo2aHoyY0hKZ1VMb1loM09HUUd0ekQxV3dTX194aHBNZTE2SGFscVRzcEhjS21UclJ3S2FYYmZob3AzdzFFUHJ2NFdBQmk1c0RpdV9DSnZTSWt2MDFTbEU0QU5pbVB0bUx5azZoUzlOalVQNEZaVVpfRVBtcEk4Y3pNc3ZWa2JFPSIsImlhdCI6MTYyNjkyODk3MSwiZXhwIjoyNTU2MTE4Nzk4fQ.9C9NvhZYKivhGWnrjo4Wr1Rv-wur1wCm0jqfK9XDD8U"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   enum: [102]
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Paramter email tidak sesuai format"
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
 *                   enum: [103]
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "Username atau password salah"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
  */
router.post('/login', controller.login);

module.exports = router;
