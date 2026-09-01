-- Step 2: Create database and employees table
-- Run: mysql -u root -p < database/setup.sql

CREATE DATABASE IF NOT EXISTS employee_management;
USE employee_management;

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(100),
    salary DECIMAL(10,2),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample employees (8 records)
INSERT INTO employees (name, email, phone, department, salary, status) VALUES
('Rahul Sharma', 'rahul@gmail.com', '9876543210', 'IT', 50000.00, 'Active'),
('Amit Patel', 'amit@gmail.com', '9876543211', 'HR', 45000.00, 'Active'),
('Priya Singh', 'priya@gmail.com', '9876543212', 'Finance', 55000.00, 'Active'),
('Sneha Reddy', 'sneha@gmail.com', '9876543213', 'Marketing', 48000.00, 'Active'),
('Vikram Mehta', 'vikram@gmail.com', '9876543214', 'IT', 62000.00, 'Active'),
('Ananya Iyer', 'ananya@gmail.com', '9876543215', 'Development', 58000.00, 'Inactive'),
('Rohan Gupta', 'rohan@gmail.com', '9876543216', 'Backend', 65000.00, 'Active'),
('Kavya Nair', 'kavya@gmail.com', '9876543217', 'Frontend', 52000.00, 'Active');
