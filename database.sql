-- USERS
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

-- BANNERS
CREATE TABLE banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    banner_name VARCHAR(100),
    banner_image TEXT,
    description TEXT
);

-- SERVICES
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_code VARCHAR(20) UNIQUE,
    service_name VARCHAR(100),
    service_icon TEXT,
    service_tariff BIGINT
);

-- TRANSACTIONS
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    invoice_number VARCHAR(50),
    transaction_type VARCHAR(10),
    description VARCHAR(100),
    total_amount BIGINT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
