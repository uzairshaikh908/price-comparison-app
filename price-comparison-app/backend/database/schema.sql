CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS comparisons (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    query_text VARCHAR(255) NOT NULL,

    best_source VARCHAR(100) NOT NULL,

    best_price DECIMAL(12,2) NOT NULL,

    best_payment_method VARCHAR(100),

    best_effective_price DECIMAL(12,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS deals (
    id INT AUTO_INCREMENT PRIMARY KEY,

    comparison_id INT NOT NULL,

    source VARCHAR(100) NOT NULL,

    original_price DECIMAL(12,2) NOT NULL,

    discount_percent DECIMAL(5,2) DEFAULT 0,

    cashback_percent DECIMAL(5,2) DEFAULT 0,

    final_price DECIMAL(12,2) NOT NULL,

    effective_price DECIMAL(12,2) NOT NULL,

    is_cheapest BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (comparison_id)
        REFERENCES comparisons(id)
        ON DELETE CASCADE
);