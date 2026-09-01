const express = require("express");
const cors = require("cors");
require("dotenv").config();

const employeeRoutes = require("./routes/employeeRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware — allow frontend dev servers (localhost and 127.0.0.1)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// Routes
app.use("/api/employees", employeeRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Employee Management API is running" });
});

// Centralized error handling
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
