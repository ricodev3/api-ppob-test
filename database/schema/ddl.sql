-- ============================================
-- NUTECH INTEGRATION - SIMPLE DDL
-- Matches current production schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    profile_image TEXT,
    balance BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BANNERS table
CREATE TABLE banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    banner_name VARCHAR(100),
    banner_image TEXT,
    description TEXT
);

-- SERVICES table
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_code VARCHAR(20) UNIQUE,
    service_name VARCHAR(100),
    service_icon TEXT,
    service_tariff BIGINT
);

-- TRANSACTIONS table
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    invoice_number VARCHAR(50),
    transaction_type VARCHAR(10),
    description VARCHAR(100),
    total_amount BIGINT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CREATE INDEXES
-- ============================================

-- Index for users email (login optimization)
CREATE INDEX idx_users_email ON users(email);

-- Index for transactions user_id and date
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_on ON transactions(created_on);
CREATE INDEX idx_transactions_invoice ON transactions(invoice_number);

-- Index for services lookup
CREATE INDEX idx_services_code ON services(service_code);

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE users IS 'Stores user accounts with authentication details and balance';
COMMENT ON TABLE banners IS 'Stores banner images for homepage display';
COMMENT ON TABLE services IS 'Stores available PPOB services with pricing';
COMMENT ON TABLE transactions IS 'Records all user transactions (topup and payments)';

COMMENT ON COLUMN users.balance IS 'User balance in Indonesian Rupiah (IDR)';
COMMENT ON COLUMN services.service_tariff IS 'Service price in Indonesian Rupiah (IDR)';
COMMENT ON COLUMN transactions.total_amount IS 'Transaction amount in Indonesian Rupiah (IDR)';
COMMENT ON COLUMN transactions.transaction_type IS 'Type: TOPUP (add balance) or PAYMENT (use balance)';