# Database Schema Documentation

## Overview
This database schema is designed for the Nutech Integration API, supporting user authentication, transactions, and PPOB services.

## Database Technology
- **Database**: PostgreSQL
- **ID Format**: UUID (Universally Unique Identifier)
- **Extensions**: `uuid-ossp` for UUID generation

## Table Relationships

```mermaid
erDiagram
    users ||--o{ transactions : "has"
    users {
        uuid id PK
        varchar(100) email UK
        varchar(255) password
        varchar(50) first_name
        varchar(50) last_name
        text profile_image
        bigint balance
        timestamp created_at
        timestamp updated_at
    }
    
    banners {
        uuid id PK
        varchar(100) banner_name
        text banner_image
        text description
    }
    
    services {
        uuid id PK
        varchar(20) service_code UK
        varchar(100) service_name
        text service_icon
        bigint service_tariff
    }
    
    transactions }|--|| users : "belongs to"
    transactions {
        uuid id PK
        uuid user_id FK
        varchar(50) invoice_number UK
        varchar(10) transaction_type
        varchar(100) description
        bigint total_amount
        timestamp created_on
    }