-- Sample Data for Inventory System
-- Insert test users and items for development and testing

-- Clear existing data (optional - comment out if you want to preserve data)
-- DELETE FROM inventory_items;
-- DELETE FROM users;

-- Insert test users
-- Password: password123 (hashed with bcryptjs)
-- You should use the registration endpoint instead of direct SQL insert

-- For testing purposes, you can manually create users via API, or insert hashed passwords:
-- Hash of 'password123': $2a$10$...

-- Sample Users (Note: passwords should be hashed via bcryptjs in production)
-- INSERT INTO users (username, email, password, role) VALUES
-- ('john_doe', 'john@example.com', 'hashed_password', 'user'),
-- ('jane_smith', 'jane@example.com', 'hashed_password', 'user'),
-- ('admin', 'admin@example.com', 'hashed_password', 'admin');

-- Sample Inventory Items
-- These should be created via the API POST /items endpoint
-- But here's the structure for reference:

INSERT INTO inventory_items (name, description, quantity, price, category, created_by) VALUES
('Laptop Pro 15', 'High-performance laptop with 16GB RAM and 512GB SSD', 5, 1299.99, 'Electronics', 1),
('Wireless Mouse', 'Ergonomic wireless mouse with 2.4GHz connection', 20, 29.99, 'Accessories', 1),
('Mechanical Keyboard', 'RGB mechanical keyboard with Cherry MX switches', 15, 129.99, 'Accessories', 1),
('4K Monitor 27inch', 'IPS panel 4K resolution monitor for professional work', 8, 399.99, 'Electronics', 2),
('USB-C Hub', 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader', 12, 59.99, 'Accessories', 2),
('Portable SSD 1TB', 'High-speed portable SSD with USB-C interface', 10, 179.99, 'Electronics', 1),
('USB-C Cable 2m', 'Fast charging USB-C cable for phones and tablets', 50, 9.99, 'Accessories', 3),
('Webcam 1080p', 'Full HD webcam with built-in microphone', 7, 49.99, 'Accessories', 2),
('Desk Lamp LED', 'Adjustable LED desk lamp with USB charging port', 18, 39.99, 'Accessories', 3),
('Headphones Wireless', 'Noise-cancelling wireless headphones with 30-hour battery', 6, 199.99, 'Electronics', 1);

-- View inserted data
SELECT 'INVENTORY SUMMARY' as '---';
SELECT COUNT(*) as 'Total Items' FROM inventory_items;
SELECT COUNT(DISTINCT created_by) as 'Total Users' FROM inventory_items;
SELECT SUM(quantity) as 'Total Quantity' FROM inventory_items;
SELECT AVG(price) as 'Average Price' FROM inventory_items;
SELECT MAX(price) as 'Max Price' FROM inventory_items;
SELECT MIN(price) as 'Min Price' FROM inventory_items;

-- View items by category
SELECT 'ITEMS BY CATEGORY' as '---';
SELECT category, COUNT(*) as 'Count', SUM(quantity) as 'Total Quantity' 
FROM inventory_items 
GROUP BY category;

-- View items created by each user
SELECT 'ITEMS BY USER' as '---';
SELECT u.id, u.username, COUNT(i.id) as 'Item Count', SUM(i.quantity) as 'Total Quantity'
FROM users u
LEFT JOIN inventory_items i ON u.id = i.created_by
GROUP BY u.id, u.username;
