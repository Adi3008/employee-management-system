const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

// GET    /api/employees       → Read all employees
router.get("/", employeeController.getAllEmployees);

// GET    /api/employees/:id   → Read one employee
router.get("/:id", employeeController.getEmployeeById);

// POST   /api/employees       → Create employee
router.post("/", employeeController.createEmployee);

// PUT    /api/employees/:id   → Replace entire employee (full update)
router.put("/:id", employeeController.replaceEmployee);

// PATCH  /api/employees/:id   → Partial update
router.patch("/:id", employeeController.patchEmployee);

// DELETE /api/employees/:id   → Delete employee
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
