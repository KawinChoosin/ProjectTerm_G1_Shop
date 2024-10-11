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
