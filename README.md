# Grievance Portal API

A robust Node.js & Express API backend for a Civic Grievance/Complaint Portal. It allows citizens to register, submit, and track complaints while providing admins the ability to manage and resolve them.

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based authentication for citizens and admins with bcrypt password hashing.
- **Citizen Portal**: Citizens can register, log in, submit new grievances, and track the real-time status of their complaints using a unique Tracking ID.
- **Admin Dashboard**: Role-based access control (RBAC) allows administrators to fetch all complaints and update their statuses (`Pending`, `InProgress`, `Resolved`).
- **Department Categorization**: Built-in endpoints to route complaints to specific city departments.

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs

## 📦 Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed (v16+ recommended).
- [PostgreSQL](https://www.postgresql.org/) database installed and running.

### 2. Clone the Repository
```bash
git clone <your-github-repo-url>
cd grievance_portal_API
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the root directory and add the following configurations:
```env
PORT=5000
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
JWT_SECRET=your_super_secret_jwt_key
```

### 5. Database Setup
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
INSERT INTO departments (department_name) VALUES ('Public Works'), ('Water & Sanitation'), ('Electricity');
```

### 6. Start the Server
For development (with hot-reload):
```bash
npm run dev
```

For production:
```bash
npm start
```
*The server should now be running at `http://localhost:5000`.*

---

## 📖 API Documentation

For detailed endpoint documentation, request payloads, and response formats, please see the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) file included in this repository.

### Quick Endpoint Overview:

**Auth:**
- `POST /api/auth/register` - Create a new citizen account
- `POST /api/auth/login` - Authenticate and get JWT

**Departments:**
- `GET /api/departments` - List all departments

**Complaints:**
- `POST /api/complaints` - Submit a complaint (Requires Auth)
- `GET /api/complaints/track/:trackingNumber` - Track complaint status (Public)
- `GET /api/complaints` - Get all complaints (Admin Only)
- `PATCH /api/complaints/:id/status` - Update complaint status (Admin Only)

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
