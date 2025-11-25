# E-REHAB: Electronic Rehabilitation System

A web-based platform for alcoholism recovery and support.

## Features
- **User Management**: Admin, Tippler, Volunteer roles.
- **Meetings**: Online meeting management.
- **Conventions**: Convention registration and booking.
- **Assessments**: Self-assessment tools.
- **Premium UI**: Modern, responsive design using React and Tailwind CSS.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Sequelize
- **Database**: MySQL

## Setup

### Prerequisites
- Node.js installed
- MySQL Server installed and running

### Installation

1.  **Database Setup**:
    - Create a MySQL database named `erehab_db`.
    - Update `server/.env` with your database credentials.

2.  **Backend Setup**:
    ```bash
    cd server
    npm install
    npm run dev
    ```

3.  **Frontend Setup**:
    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Access**:
    - Frontend: http://localhost:5173
    - Backend: http://localhost:5000
