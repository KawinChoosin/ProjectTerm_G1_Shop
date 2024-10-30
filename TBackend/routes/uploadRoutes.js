/**
 * @swagger
 * tags:
 *   - name: Uploads
 *     description: File upload API
 * 
 * /uploads/slip:
 *   post:
 *     summary: Upload a payslip
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               slip:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Payslip uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payslipPath:
 *                   type: string
 *                   description: The path where the uploaded payslip is stored
 *       '400':
 *         description: Bad Request (No file uploaded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */


// uploadRoutes.js
const express = require("express");
const upload = require("../upload"); // Import the multer configuration

const router = express.Router();

// Create the upload endpoint for payslip
router.post("/slip", upload.single("slip"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Return the file path (or any other information you want)
  res.json({ payslipPath: req.file.path });
});

module.exports = router;
