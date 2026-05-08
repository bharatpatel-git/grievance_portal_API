import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT department_id as "departmentId", department_name as "departmentName" FROM departments ORDER BY department_name ASC',
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
