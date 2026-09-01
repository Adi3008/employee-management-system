# Employee Management System

A full-stack CRUD application for learning React, Redux Toolkit (RTK Query), Node.js, Express, and MySQL.

| Layer    | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:5173    |
| Backend  | http://localhost:6000    |
| Database | MySQL (`employee_management`) |

---

## Quick Start

### 1. Database setup

```bash
mysql -u root -p < database/setup.sql
```

Update `backend/.env` with your MySQL password:

```env
PORT=6000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=employee_management
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Project Structure

```
Node-React/
├── backend/          # Express REST API
├── frontend/         # React + Vite + RTK Query
└── database/         # SQL setup script
```

---

## API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | /api/employees        | Get all employees        |
| GET    | /api/employees/:id    | Get employee by ID       |
| POST   | /api/employees        | Create employee          |
| PUT    | /api/employees/:id    | Replace entire employee  |
| PATCH  | /api/employees/:id    | Partial update           |
| DELETE | /api/employees/:id    | Delete employee          |

Optional server-side search: `GET /api/employees?search=rahul`

---

## Postman Testing

### GET all employees

```
GET http://localhost:6000/api/employees
```

### GET by ID

```
GET http://localhost:6000/api/employees/1
```

### POST create

```
POST http://localhost:6000/api/employees
Content-Type: application/json

{
  "name": "Aditya",
  "email": "aditya@gmail.com",
  "phone": "9876543210",
  "department": "Development",
  "salary": 60000,
  "status": "Active"
}
```

### PUT replace (full update)

```
PUT http://localhost:6000/api/employees/1
Content-Type: application/json

{
  "name": "Aditya Balpande",
  "email": "aditya@gmail.com",
  "phone": "9999999999",
  "department": "Frontend",
  "salary": 70000,
  "status": "Active"
}
```

### PATCH partial update

```
PATCH http://localhost:6000/api/employees/1
Content-Type: application/json

{
  "salary": 75000
}
```

### DELETE

```
DELETE http://localhost:6000/api/employees/1
```

---

## HTTP Methods Cheat Sheet

| Method | Purpose                          |
|--------|----------------------------------|
| GET    | Read data                        |
| POST   | Create data                      |
| PUT    | Completely update/replace data   |
| PATCH  | Partially update data            |
| DELETE | Delete data                      |

---

## Request Flow

```
React Component
      ↓
RTK Query (employeeApi.ts)
      ↓
HTTP Request (fetch)
      ↓
Node.js (server.js)
      ↓
Express Route (employeeRoutes.js)
      ↓
Controller (employeeController.js)
      ↓
Model (employeeModel.js)
      ↓
MySQL (employees table)
      ↓
JSON Response
      ↓
RTK Query Cache (tag invalidation)
      ↓
React UI re-renders
```

See [TUTORIAL.md](./TUTORIAL.md) for the full step-by-step learning guide (Steps 1–28).
