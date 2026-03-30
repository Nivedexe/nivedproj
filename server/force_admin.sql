-- Run this in your MySQL Workbench to force create the admin user
SET SQL_SAFE_UPDATES = 0;
USE erehab_db;
DELETE FROM Users WHERE email = 'admin@erehab.com' OR username = 'admin';
INSERT INTO Users (username, email, password, role, isApproved, createdAt, updatedAt) 
VALUES ('admin', 'admin@erehab.com', '$2a$10$76S6GvL4XhB3m.B8u4.hYuFjU8rG3M8o8u6O8U8u8O8u8O8u8O8u8', 'admin', 1, NOW(), NOW());
SET SQL_SAFE_UPDATES = 1;
-- Note: The password will be 'password' (you can change it later)
