-- E-REHAB Database Schema
-- Database: erehab_db

CREATE DATABASE IF NOT EXISTS erehab_db;
USE erehab_db;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    groupName VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'tippler', 'volunteer') DEFAULT 'tippler',
    isApproved BOOLEAN DEFAULT FALSE,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    phone VARCHAR(255),
    sobrietyDate DATE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Meetings Table
CREATE TABLE IF NOT EXISTS Meetings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    groupName VARCHAR(255),
    description TEXT,
    dateTime DATETIME NOT NULL,
    link VARCHAR(255),
    type ENUM('Open', 'Closed') DEFAULT 'Open',
    price DECIMAL(10, 2) DEFAULT 0.00,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Conventions Table
CREATE TABLE IF NOT EXISTS Conventions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    startDate DATE,
    endDate DATE,
    description TEXT,
    tariff DECIMAL(10, 2),
    hotelName VARCHAR(255),
    hotelDetails TEXT,
    roomTariffs TEXT, -- JSON stored as TEXT
    maxCapacity INT DEFAULT 100,
    registeredCount INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ConventionRegistrations Table
CREATE TABLE IF NOT EXISTS ConventionRegistrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    memberCount INT DEFAULT 1,
    roomType VARCHAR(255) DEFAULT 'Single',
    foodPreference ENUM('Veg', 'Non-Veg', 'Vegan', 'Buffet') DEFAULT 'Veg',
    totalAmount DECIMAL(10, 2) DEFAULT 0.00,
    UserId INT,
    ConventionId INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE SET NULL,
    FOREIGN KEY (ConventionId) REFERENCES Conventions(id) ON DELETE SET NULL
);

-- Feedbacks Table
CREATE TABLE IF NOT EXISTS Feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    rating INT NOT NULL,
    UserId INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE SET NULL
);

-- Tests Table
CREATE TABLE IF NOT EXISTS Tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    criteria TEXT,
    questions TEXT, -- JSON stored as TEXT
    scoringLogic TEXT, -- JSON stored as TEXT
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TestResults Table
CREATE TABLE IF NOT EXISTS TestResults (
    id INT AUTO_INCREMENT PRIMARY KEY,
    answers TEXT NOT NULL, -- JSON stored as TEXT
    score FLOAT DEFAULT 0,
    resultBand TEXT, -- JSON stored as TEXT
    isEvaluated BOOLEAN DEFAULT FALSE,
    adminFeedback TEXT,
    UserId INT,
    TestId INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE SET NULL,
    FOREIGN KEY (TestId) REFERENCES Tests(id) ON DELETE SET NULL
);

-- Payments Table
CREATE TABLE IF NOT EXISTS Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    paymentMethod VARCHAR(255),
    transactionId VARCHAR(255),
    UserId INT,
    ConventionId INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE SET NULL,
    FOREIGN KEY (ConventionId) REFERENCES Conventions(id) ON DELETE SET NULL
);

-- Newsletters Table
CREATE TABLE IF NOT EXISTS Newsletters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- UserMeetings (Join Table for Many-to-Many)
CREATE TABLE IF NOT EXISTS UserMeetings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT,
    MeetingId INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE SET NULL,
    FOREIGN KEY (MeetingId) REFERENCES Meetings(id) ON DELETE SET NULL
);
