API PPOB - Nutech Integration API
📋 Project Overview
A Payment Point Online Bank (PPOB) API built with Express.js for technical test implementation. This API handles membership, services, transactions, and balance management with JWT authentication and Swagger documentation.

🚀 Live Deployment
API URL: https://nutech-api-production-d655.up.railway.app

Swagger Documentation: https://nutech-api-production-d655.up.railway.app/api-docs

Health Check: https://nutech-api-production-d655.up.railway.app/health

🛠️ Technology Stack
Backend: Node.js, Express.js

Database: Supabase PostgreSQL

Authentication: JWT (JSON Web Tokens)

Documentation: Swagger/OpenAPI 3.0

File Upload: Multer with Railway-compatible storage

Deployment: Railway.app

📁 Project Structure
text
api-ppob-test/
├── src/
│   ├── controllers/          # Business logic handlers
│   ├── routes/              # API route definitions
│   ├── middleware/          # Authentication & upload middleware
│   └── uploads/             # Local file storage (development)
├── database/
│   └── schema/
│       └── ddl.sql          # Database schema
├── scripts/                 # Setup and utility scripts
├── utils/                   # Helper functions
├── app.js                   # Main application entry point
├── swagger.js              # Swagger/OpenAPI configuration
├── package.json
├── .env.example
└── railway.json            # Railway deployment configuration
📊 Database Schema (DDL)
Users Table
sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image TEXT,
    balance INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add updated_at column if needed
-- ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
Banners Table
sql
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    banner_name VARCHAR(255) NOT NULL,
    banner_image TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Services Table
sql
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(50) UNIQUE NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_icon TEXT NOT NULL,
    service_tarif INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Transactions Table
sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'PAYMENT' or 'TOPUP'
    description TEXT,
    total_amount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Index for faster user transaction queries
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
Transaction Items Table (for detailed payments)
sql
CREATE TABLE transaction_items (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
    service_code VARCHAR(50),
    service_name VARCHAR(255),
    quantity INTEGER DEFAULT 1,
    price INTEGER NOT NULL,
    subtotal INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
🔧 Installation & Setup
Prerequisites
Node.js (v18 or higher)

PostgreSQL database (Supabase recommended)

npm or yarn

1. Clone Repository
bash
git clone https://github.com/ricodev3/api-ppob-test.git
cd api-ppob-test
2. Install Dependencies
bash
npm install
3. Environment Configuration
Copy .env.example to .env and configure:

env
# Server Configuration
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000

# Database (Supabase)
SUPABASE_DB_URL=postgresql://username:password@host:5432/database

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Railway (for production)
RAILWAY_PUBLIC_DOMAIN=your-app.up.railway.app
4. Database Setup
bash
# Run the DDL schema
psql -d your_database -f database/schema/ddl.sql

# Or use the setup script
npm run setup
5. Start Development Server
bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
The API will be available at http://localhost:3000

📖 API Documentation
Access Swagger UI
Once the server is running, visit: http://localhost:3000/api-docs

Authentication
Register - Create a new user account

Login - Get JWT token

Use Token - Add Authorization: Bearer <token> to request headers

Available Modules
1. Membership Module
POST /api/registration - User registration

POST /api/login - User login

GET /api/profile - Get user profile

PUT /api/profile - Update user profile

PUT /api/profile/image - Upload profile image (JPEG/PNG only)

2. Services Module
GET /api/banners - Get all banners

GET /api/services - Get all services

3. Transaction Module
POST /api/topup - Top up balance

POST /api/transaction - Make a payment

GET /api/transaction/history - Get transaction history

4. Balance Module
GET /api/balance - Check current balance

PUT /api/balance - Update balance

🔒 API Response Format
Success Response
json
{
  "status": 0,
  "message": "Success message",
  "data": { /* response data */ }
}
Error Responses
Status Code	Status	Description
400	102	Invalid parameters or format
400	103	Invalid username or password
401	108	Invalid or expired token
404	1	Data not found
500	1	Internal server error
🚀 Deployment
Railway Deployment
Connect your GitHub repository to Railway

Add environment variables in Railway dashboard

Railway automatically detects railway.json configuration

Manual Deployment
bash
# Build and run in production
npm ci --only=production
NODE_ENV=production npm start
📝 File Upload Specifications
Profile Image Upload
Endpoint: PUT /api/profile/image

Method: PUT

Authentication: Bearer Token required

File Requirements:

Formats: JPEG, JPG, PNG only

Maximum size: 5MB

Field name: file

Response: Returns updated user profile with image URL

🧪 Testing
Health Check
bash
curl https://nutech-api-production-d655.up.railway.app/health
Example API Call with cURL
bash
# Login
curl -X POST https://nutech-api-production-d655.up.railway.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Upload profile image (with token)
curl -X PUT https://nutech-api-production-d655.up.railway.app/api/profile/image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@./profile.jpg"
⚠️ Important Notes
File Storage
Development: Files stored in src/uploads/

Production (Railway): Files stored in /tmp/uploads/ (ephemeral)

Recommendation: For production, use cloud storage (S3, Cloudinary) or Railway Volumes

Database Considerations
The updated_at column is optional in users table

Ensure proper indexes on frequently queried columns

Regular backups recommended for production

Security
Always use HTTPS in production

Keep JWT_SECRET secure and rotate periodically

Validate all user inputs

Implement rate limiting for production

🐛 Troubleshooting
Common Issues
"Service unavailable" on Railway

Check environment variables

Verify database connection

Check Railway logs for errors

Database connection errors

Verify SUPABASE_DB_URL is correct

Check if database is accessible

Ensure SSL is properly configured

File upload errors

Check file size (max 5MB)

Verify file format (JPEG/PNG only)

Ensure upload directory has write permissions

Debug Mode
Enable detailed logging by setting NODE_ENV=development

📄 License
This project is for technical test purposes.

👥 Contact & Support
Repository: https://github.com/ricodev3/api-ppob-test

Issues: Use GitHub Issues for bug reports

Note: This API is configured for Railway deployment with automatic scaling and health checks. The current deployment is available at the provided Railway URL.