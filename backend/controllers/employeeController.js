const EmployeeModel = require("../models/employeeModel");

/** Validate email format */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/** Validate employee data for create / full replace (PUT) */
const validateEmployee = (data, isPartial = false) => {
  const errors = [];

  if (!isPartial || data.name !== undefined) {
    if (!data.name || data.name.trim() === "") {
      errors.push("Name is required");
    }
  }

  if (!isPartial || data.email !== undefined) {
    if (!data.email || data.email.trim() === "") {
      errors.push("Email is required");
    } else if (!isValidEmail(data.email)) {
      errors.push("Email must be valid");
    }
  }

  if (!isPartial || data.salary !== undefined) {
    if (data.salary !== undefined && data.salary !== null && data.salary !== "") {
      const salary = Number(data.salary);
      if (isNaN(salary) || salary <= 0) {
        errors.push("Salary must be a positive number");
      }
    }
  }

  if (data.status !== undefined && !["Active", "Inactive"].includes(data.status)) {
    errors.push("Status must be Active or Inactive");
  }

  return errors;
};

const employeeController = {
  /** GET /api/employees — Read all employees */
  async getAllEmployees(req, res, next) {
    try {
      const search = req.query.search || "";
      const employees = await EmployeeModel.findAll(search);
      res.status(200).json({ success: true, data: employees });
    } catch (error) {
      next(error);
    }
  },

  /** GET /api/employees/:id — Read one employee by ID */
  async getEmployeeById(req, res, next) {
    try {
      const employee = await EmployeeModel.findById(req.params.id);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      res.status(200).json({ success: true, data: employee });
    } catch (error) {
      next(error);
    }
  },

  /** POST /api/employees — Create a new employee */
  async createEmployee(req, res, next) {
    try {
      const errors = validateEmployee(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ success: false, message: errors.join(", ") });
      }

      const existing = await EmployeeModel.findByEmail(req.body.email);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      const employee = await EmployeeModel.create(req.body);
      res.status(201).json({ success: true, data: employee });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
      next(error);
    }
  },

  /**
   * PUT /api/employees/:id — Complete replacement/update
   *
   * PUT replaces the ENTIRE employee object. You must send all fields
   * (name, email, phone, department, salary, status) even if only
   * one value changed. Think of it as overwriting the whole record.
   */
  async replaceEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await EmployeeModel.findById(id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      const errors = validateEmployee(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ success: false, message: errors.join(", ") });
      }

      if (req.body.email !== existing.email) {
        const duplicate = await EmployeeModel.findByEmail(req.body.email);
        if (duplicate) {
          return res.status(409).json({
            success: false,
            message: "Email already exists",
          });
        }
      }

      const employee = await EmployeeModel.replace(id, req.body);
      res.status(200).json({ success: true, data: employee });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
      next(error);
    }
  },

  /**
   * PATCH /api/employees/:id — Partial update
   *
   * PATCH updates ONLY the fields you send. For example, sending
   * { "salary": 75000 } will change only the salary column.
   */
  async patchEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await EmployeeModel.findById(id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields provided to update",
        });
      }

      const errors = validateEmployee(req.body, true);
      if (errors.length > 0) {
        return res.status(400).json({ success: false, message: errors.join(", ") });
      }

      if (req.body.email && req.body.email !== existing.email) {
        const duplicate = await EmployeeModel.findByEmail(req.body.email);
        if (duplicate) {
          return res.status(409).json({
            success: false,
            message: "Email already exists",
          });
        }
      }

      const employee = await EmployeeModel.patch(id, req.body);
      res.status(200).json({ success: true, data: employee });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
      next(error);
    }
  },

  /** DELETE /api/employees/:id — Remove an employee */
  async deleteEmployee(req, res, next) {
    try {
      const deleted = await EmployeeModel.remove(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Employee deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = employeeController;
