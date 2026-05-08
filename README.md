# 🏛️ Jan Sampark - Grievance Portal

**Live Demo:** [https://grievance-frontend.netlify.app](https://grievance-frontend.netlify.app)

A complete, full-stack Civic Grievance & Complaint Management Portal designed to bridge the gap between citizens and city administration. This platform allows citizens to easily register, submit, and track their civic complaints in real-time. It also provides administrators with a powerful, role-based dashboard to securely manage and resolve these grievances across various city departments.

This repository is a monorepo containing both the vanilla HTML/JS frontend UI and the robust Node.js/Express backend API.

> **Note:** The frontend UI of this application was designed and generated entirely using AI tools like Claude!

## 🌐 Live Deployment

- **Frontend:** Hosted on Netlify
- **Backend API:** Hosted on Render
- **Database:** Supabase (PostgreSQL)

## 🚀 Features

- **Frontend UI**: Responsive HTML pages for Citizen Login, Registration, Complaint Tracking, and Admin Dashboard.
- **Authentication & Authorization**: Secure JWT-based authentication for citizens and admins with bcrypt password hashing.
- **Citizen Portal**: Citizens can register, log in, submit new grievances, and track the real-time status of their complaints using a unique Tracking ID.
- **Admin Dashboard**: Role-based access control (RBAC) allows administrators to fetch all complaints and update their statuses (`Pending`, `InProgress`, `Resolved`).
- **Department Categorization**: Built-in endpoints to route complaints to specific city departments.

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend Runtime**: Node.js
- **Backend Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs

## 📦 Project Structure

```text
grievance_portal/
├── frontend/             # HTML, CSS, and JS files for the UI
└── backend/              # Node.js/Express API and database configuration
```

## 💻 Installation & Setup

### 1. Prerequisites

- [Node.js](https://nodejs.org/) installed (v16+ recommended).
- [PostgreSQL](https://www.postgresql.org/) database installed and running.

### 2. Clone the Repository

```bash
git clone https://github.com/bharatpatel-git/grievance_portal.git
cd grievance_portal
```

### 3. Backend Setup

Navigate to the backend directory, install dependencies, and configure your environment variables.

```bash
cd backend
npm install
```

Create a `.env` file in the **`backend`** directory and add the following configurations:

```env
PORT=5000
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Database Setup

Create a PostgreSQL database and execute the following SQL commands to create the necessary tables:

```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'Citizen'
);

CREATE TABLE departments (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL
);

CREATE TABLE complaints (
  complaint_id SERIAL PRIMARY KEY,
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  department_id INT REFERENCES departments(department_id),
  citizen_id INT REFERENCES users(user_id),
  status VARCHAR(50) DEFAULT 'Pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some dummy departments
INSERT INTO departments (department_name) VALUES
('Roads & Public Works'),
('Electricity'),
('Water Supply'),
('Garbage & cleaning'),
('Street lights & parks');
```

### 5. Start the Application

**Start the Backend Server:**
Inside the `backend` folder, run:

```bash
# For development (with hot-reload):
npm run dev

# For production:
npm start
```

_The API server should now be running at `http://localhost:5000`._

**Start the Frontend:**
Simply navigate to the `frontend` directory and open the `index.html` file in your web browser. Alternatively, you can use a tool like VS Code's "Live Server" extension to serve the files locally.

---

## 📖 API Documentation

For detailed endpoint documentation, request payloads, and response formats, please see the [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) file included in the backend directory.
