# Step-by-Step Tutorial — Employee Management System

This guide walks through building the project from scratch, in learning order.

---

## Step 1 — Project Architecture

```
┌─────────────┐     HTTP/REST      ┌─────────────┐     SQL       ┌──────────┐
│   React     │ ◄──────────────► │   Express   │ ◄───────────► │  MySQL   │
│  (Frontend) │   RTK Query       │  (Backend)  │   mysql2      │          │
└─────────────┘                   └─────────────┘               └──────────┘
```

**Frontend layers:**
- **Pages** — full screens (list, add, edit, details)
- **Components** — reusable UI (table, form, loading)
- **RTK Query API** — all HTTP calls (no Axios)
- **Redux Store** — holds API cache and middleware

**Backend layers:**
- **Routes** — map URLs to controller functions
- **Controllers** — handle request/response and validation
- **Models** — run SQL queries against MySQL
- **Middleware** — centralized error handling

---

## Step 2 — Create MySQL Database and Table

Run the setup script:

```bash
mysql -u root -p < database/setup.sql
```

This creates:
- Database: `employee_management`
- Table: `employees`
- 8 sample employees

---

## Step 3 — Create Node.js Project

```bash
mkdir backend && cd backend
npm init -y
```

Files created: `package.json`, `server.js`

---

## Step 4 — Install Backend Dependencies

```bash
npm install express cors dotenv mysql2
npm install -D nodemon
```

| Package  | Purpose                    |
|----------|----------------------------|
| express  | Web framework              |
| cors     | Allow frontend requests    |
| dotenv   | Load `.env` variables      |
| mysql2   | MySQL driver with promises |
| nodemon  | Auto-restart on file change|

---

## Step 5 — MySQL Connection

File: `backend/config/db.js`

Uses a **connection pool** so multiple requests share DB connections efficiently. Credentials come from `.env` — never hardcoded.

---

## Step 6 — Employee Model

File: `backend/models/employeeModel.js`

Contains SQL for:
- `findAll()` — SELECT all
- `findById()` — SELECT by id
- `create()` — INSERT
- `replace()` — UPDATE all fields (PUT)
- `patch()` — UPDATE only provided fields (PATCH)
- `remove()` — DELETE

---

## Step 7 — GET All Employees

```
GET /api/employees
```

Controller returns `{ success: true, data: [...] }` with status **200**.

---

## Step 8 — GET Employee by ID

```
GET /api/employees/:id
```

Returns **404** if not found: `{ success: false, message: "Employee not found" }`

---

## Step 9 — POST Create Employee

```
POST /api/employees
```

Validates name, email, salary. Returns **201** on success, **409** for duplicate email.

---

## Step 10 — PUT Replace Employee

```
PUT /api/employees/:id
```

**PUT = complete replacement.** Send ALL fields every time, even if only one changed.

---

## Step 11 — PATCH Partial Update

```
PATCH /api/employees/:id
```

**PATCH = partial update.** Send only the fields you want to change.

Example: `{ "salary": 75000 }` updates only salary.

---

## Step 12 — DELETE Employee

```
DELETE /api/employees/:id
```

Returns `{ success: true, message: "Employee deleted successfully" }`

---

## Step 13 — Test APIs in Postman

Start backend: `npm run dev`

Test each endpoint listed in README.md. Verify status codes:
- 200 — GET, PUT, PATCH success
- 201 — POST success
- 400 — validation error
- 404 — not found
- 409 — duplicate email

---

## Step 14 — Create React + Vite Project

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

---

## Step 15 — Install Redux Toolkit and RTK Query

```bash
npm install @reduxjs/toolkit react-redux react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

RTK Query is included in `@reduxjs/toolkit` — no separate package needed.

---

## Step 16 — Configure Redux Store

File: `frontend/src/app/store.ts`

- Registers `employeeApi.reducer`
- Adds `employeeApi.middleware` for caching

Wrap app in `main.tsx`:

```tsx
<Provider store={store}>
  <App />
</Provider>
```

---

## Step 17 — Create RTK Query API

File: `frontend/src/api/employeeApi.ts`

Endpoints:
- `getEmployees` — query
- `getEmployeeById` — query
- `createEmployee` — mutation
- `updateEmployee` — mutation (PUT)
- `patchEmployee` — mutation (PATCH)
- `deleteEmployee` — mutation

Uses `tagTypes: ["Employees"]` for cache invalidation after mutations.

---

## Step 18 — Employee List Page

File: `frontend/src/pages/EmployeeList.tsx`

Shows table with View / Edit / Delete actions and Add button.

---

## Step 19 — Connect GET API

Uses `useGetEmployeesQuery()` hook. Handles loading, error (with Retry), and empty states.

---

## Step 20 — Add Employee Form + POST

File: `frontend/src/pages/AddEmployee.tsx`

Uses `useCreateEmployeeMutation()`. On success: message → cache refresh → navigate home.

---

## Step 21 — Edit Employee + PUT

File: `frontend/src/pages/EditEmployee.tsx`

Uses `useUpdateEmployeeMutation()` with PUT for full record update.

---

## Step 22 — PATCH Functionality

On **Employee Details** page: Activate / Deactivate buttons call `usePatchEmployeeMutation()` with only `{ status }`.

---

## Step 23 — DELETE

List page confirms deletion, calls `useDeleteEmployeeMutation()`, cache auto-refreshes via tag invalidation.

---

## Step 24 — Employee Details Page

File: `frontend/src/pages/EmployeeDetails.tsx`

Uses `useGetEmployeeByIdQuery(id)` to show all fields including created/updated dates.

---

## Step 25 — React Router

Routes in `App.tsx`:
- `/` — list
- `/employees/add` — create
- `/employees/:id` — details
- `/employees/:id/edit` — edit

---

## Step 26 — Loading / Error / Success Handling

Every page uses:
- `<Loading />` during fetch
- Error message + Retry button
- Success toasts after create/update/delete

---

## Step 27 — Search

**Frontend filtering** on the list page (name, email, department, phone).

**Optional server-side:** `GET /api/employees?search=rahul` is also supported by the backend.

---

## Step 28 — Complete Request Flow

Example: User clicks "Delete" on employee #3

1. `EmployeeList` calls `deleteEmployee(3)`
2. RTK Query sends `DELETE http://localhost:6000/api/employees/3`
3. Express route `employeeRoutes.js` matches `DELETE /:id`
4. `employeeController.deleteEmployee` runs
5. `EmployeeModel.remove(3)` executes `DELETE FROM employees WHERE id = 3`
6. MySQL deletes the row
7. Response: `{ success: true, message: "..." }`
8. RTK Query invalidates `Employees` tags
9. `getEmployees` refetches automatically
10. Table re-renders without deleted row

---

## HTTP Methods Summary

```
GET     → Read data
POST    → Create data
PUT     → Completely update/replace data
PATCH   → Partially update data
DELETE  → Delete data
```
