const pool = require("../config/db");

const EmployeeModel = {
  /**
   * Get all employees, optionally filtered by search query.
   * Server-side search: GET /api/employees?search=rahul
   */
  async findAll(search) {
    let query = "SELECT * FROM employees";
    const params = [];

    if (search) {
      query +=
        " WHERE name LIKE ? OR email LIKE ? OR department LIKE ? OR phone LIKE ?";
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += " ORDER BY id ASC";

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM employees WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },

  async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM employees WHERE email = ?",
      [email]
    );
    return rows[0];
  },

  async create(employee) {
    const { name, email, phone, department, salary, status } = employee;
    const [result] = await pool.query(
      `INSERT INTO employees (name, email, phone, department, salary, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone || null, department || null, salary || null, status || "Active"]
    );
    return this.findById(result.insertId);
  },

  /**
   * PUT — complete replacement of an employee record.
   * All fields must be provided in the request body.
   */
  async replace(id, employee) {
    const { name, email, phone, department, salary, status } = employee;
    await pool.query(
      `UPDATE employees
       SET name = ?, email = ?, phone = ?, department = ?, salary = ?, status = ?
       WHERE id = ?`,
      [name, email, phone || null, department || null, salary || null, status || "Active", id]
    );
    return this.findById(id);
  },

  /**
   * PATCH — partial update. Only provided fields are updated.
   */
  async patch(id, fields) {
    const allowedFields = ["name", "email", "phone", "department", "salary", "status"];
    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (fields[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(fields[field]);
      }
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.query(
      `UPDATE employees SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    return this.findById(id);
  },

  async remove(id) {
    const [result] = await pool.query("DELETE FROM employees WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  },
};

module.exports = EmployeeModel;
