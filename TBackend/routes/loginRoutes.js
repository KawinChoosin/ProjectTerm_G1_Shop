const express = require("express");
const prisma = require("../prisma/client");

const router = express.Router();

const jwt = require("jsonwebtoken");

// Define a secret key for JWT (you should store this securely in an environment variable)
const JWT_SECRET = "your_jwt_secret_key";

// Add product to cart
router.post("/", async (req, res) => {
  const { C_name, C_password } = req.body;

  try {
    // Find user by username
    const users = await prisma.customer.findMany({
      where: { C_name },
    });

    // Check if the user exists
    if (!users || users.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = users[0]; // Get the first user from the array

    // Check if password is defined and matches
    if (user.C_password === undefined || user.C_password !== C_password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // If login is successful, generate a token
    const token = jwt.sign(
      { C_id: user.C_id, C_name: user.C_name },
      JWT_SECRET,
      {
        expiresIn: "1h", // Token will expire in 1 hour
      }
    );

    return res.json({
      message: "Login successful",
      token, // Send the token back to the client
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

module.exports = router;
