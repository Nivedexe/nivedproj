# E-REHAB: Electronic Rehabilitation System

A web-based platform designed to support alcoholism recovery and rehabilitation through community meetings, self-assessments, recovery conventions, and volunteer mentorship.

---

## 🌟 Key Features

- **Role-Based Access Control**:
  - **Admin**: Manage users, approve accounts, schedule meetings, create conventions, configure self-assessment tests, and review feedback.
  - **Volunteer**: Mentor individuals, host recovery meetings, monitor assessments, and provide recovery support.
  - **Tippler / Member**: Join daily and custom fellowship meetings, register for conventions, complete self-assessments with scoring insights, and submit feedback.
- **Meeting Management**:
  - 3 Daily fellowship sessions (Morning, Midday, Evening) plus specialized workshops with direct video links.
- **Convention & Hotel Booking**:
  - Browse conventions across various locations, select room types, view tariffs, and register attendees.
- **Self-Assessment Diagnostic Tools**:
  - Interactive questionnaires with weighted scoring and tailored recovery guidance.
- **Modern Responsive UI**:
  - Clean, accessible interface built with React and Tailwind CSS.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Lucide React, Axios
- **Backend**: Node.js, Express.js, Sequelize ORM, JSON Web Tokens (JWT), Bcrypt.js
- **Database**: MySQL

---

## 🚀 Setup & Installation Guide

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MySQL Server** (running locally or remotely)
- **npm** (comes with Node.js)

---

### Step 1: Database Configuration
1. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or MySQL CLI).
2. Create a database named `erehab_db`:
   ```sql
   CREATE DATABASE erehab_db;
   ```
3. Navigate to the `server/` directory and configure environment variables:
   - Copy `server/.env.sample` to `server/.env` (if not already present).
   - Update your MySQL credentials:
     ```env
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASS=your_mysql_password
     DB_NAME=erehab_db
     JWT_SECRET=your_jwt_secret_key
     ```

---

### Step 2: Install Dependencies

From the project root:
```bash
npm install
```
*(This installs root, client, and server dependencies via npm workspaces.)*

Alternatively, you can install them separately:
```bash
cd server && npm install
cd ../client && npm install
```

---

### Step 3: Populate Database with Seed Data

To automatically create all required tables and populate demo accounts, meetings, conventions, assessments, and feedback:
```bash
cd server
npm run seed
```
*(Optional: You can also inspect or import `server/scripts/e_rehab_schema.sql` directly into MySQL.)*

---

### Step 4: Run the Application

#### Option A: Run concurrently from root
```bash
# Terminal 1 (Backend)
npm run dev:server

# Terminal 2 (Frontend)
npm run dev:client
```

#### Option B: Run individually
```bash
# Terminal 1 - Backend Server (Runs on http://localhost:5000)
cd server
npm run dev

# Terminal 2 - Frontend Client (Runs on http://localhost:5173)
cd client
npm run dev
```

---

## 👥 Demo User Credentials

After running `npm run seed`, you can log in using any of the following accounts:

| Role | Email | Password | Access / Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@erehab.com` | `adminpassword123` | Full administrative control, user approvals, convention and meeting management |
| **Volunteer** | `john.v@example.com` | `password123` | Host recovery meetings, provide feedback, mentor members |
| **Member / Tippler** | `mike.t@example.com` | `password123` | Join daily meetings, book convention packages, take self-assessments |

*(Note: You can also register a new member account via the Registration page; admin approval may be required depending on role settings.)*

---

## 📁 Project Architecture

```
nivedproj/
├── client/                     # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, ProtectedRoute)
│   │   ├── context/            # AuthContext and state management
│   │   ├── pages/              # Dashboards, Meetings, Conventions, Assessments
│   │   │   └── admin/          # Admin management forms
│   │   ├── utils/              # Location and geographic data
│   │   ├── App.jsx             # Route definitions
│   │   └── main.jsx            # Application entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend Application (Node + Express + Sequelize)
│   ├── config/                 # Database configuration (db.js)
│   ├── controllers/            # Route controllers (Auth, Meetings, Conventions, etc.)
│   ├── middleware/             # JWT authentication and authorization middleware
│   ├── models/                 # Sequelize database models
│   ├── routes/                 # Express API routes
│   ├── scripts/                # Database schema (e_rehab_schema.sql) and seeders
│   ├── utils/                  # Server startup utilities
│   ├── .env.sample             # Sample environment variables
│   ├── index.js                # Server entry point
│   └── package.json
│
├── .gitignore                  # Git ignore rules
├── package.json                # Root package with workspace scripts
└── README.md                   # Project documentation
```
