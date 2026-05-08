import express from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "../db.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Publicly submit a complaint (requires authentication as Citizen)
router.post("/", authenticateToken, async (req, res) => {
  const { departmentId, title, description } = req.body;
  const citizenId = req.user.userId;

  if (!departmentId || !title || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = uuidv4().split("-")[0].toUpperCase().substring(0, 4);
    const trackingNumber = `GRV-${datePart}-${randomPart}`;

    await pool.query(
      `INSERT INTO complaints (tracking_number, title, description, department_id, citizen_id) 
       VALUES ($1, $2, $3, $4, $5)`,
      [trackingNumber, title, description, departmentId, citizenId],
    );

    res
      .status(201)
      .json({ trackingNumber, message: "Complaint filed successfully" });
  } catch (err) {
    console.error("Error filing complaint:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Publicly track a complaint
router.get("/track/:trackingNumber", async (req, res) => {
  const { trackingNumber } = req.params;

  try {
    const result = await pool.query(
      `SELECT c.tracking_number as "trackingNumber", c.title, d.department_name as "departmentName", 
              u.full_name as "citizenName", c.description, c.submitted_at as "submittedAt", 
              c.updated_at as "updatedAt", c.status
       FROM complaints c
       LEFT JOIN departments d ON c.department_id = d.department_id
       LEFT JOIN users u ON c.citizen_id = u.user_id
       WHERE c.tracking_number = $1`,
      [trackingNumber],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Complaint not found with this tracking number" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error tracking complaint:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin: Get all complaints
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.complaint_id as "complaintId", c.tracking_number as "trackingNumber", c.title, 
            d.department_name as "departmentName", u.full_name as "citizenName", c.status, 
            c.submitted_at as "submittedAt", c.updated_at as "updatedAt", c.description
       FROM complaints c
       LEFT JOIN departments d ON c.department_id = d.department_id
       LEFT JOIN users u ON c.citizen_id = u.user_id
       ORDER BY c.submitted_at DESC`,
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin: Update complaint status
router.patch("/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const validStatuses = ["Pending", "InProgress", "Resolved"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status. Must be one of: " + validStatuses.join(", "),
    });
  }

  try {
    const result = await pool.query(
      `UPDATE complaints 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE complaint_id = $2 RETURNING *`,
      [status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint status updated successfully" });
  } catch (err) {
    console.error("Error updating complaint status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
