const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const prisma = require("../prisma/client");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const client = new OAuth2Client(
  process.env.GOOGLE_CID,
  process.env.GOOGLE_CS,
  "http://localhost:5173/auth/google/callback"
);

router.get("/callback", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Database connection error" });
  }
});

router.post("/callback", async (req, res) => {
  const { code } = req.body; // Get the authorization code from the query parameters
  // console.log(code);
  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing." });
  }
  try {
    // Exchange the authorization code for tokens
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;
    // console.log("Tokens received:", tokens); // Log tokens

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CID,
    });

    const payload = ticket.getPayload();
    // console.log(payload);
    const username = payload.name.replace(/\s+/g, "");
    // console.log(username);
    const email = payload.email;

    // Check if the user exists in the database
    const user = await prisma.customer.findMany({ where: { C_email: email } });

    if (user.length > 0) {
      return res.json({ C_id: user[0].C_id, C_email: email });
    } else {
      function uuidToInteger() {
        const uuid = uuidv4().replace(/-/g, ""); // Remove dashes
        return parseInt(uuid.slice(0, 15), 16) % 2147483647; // Convert the first 15 hex digits to integer
      }

      const C_id = uuidToInteger();

      // Create new customer record
      const newCustomer = await prisma.customer.create({
        data: {
          C_id,
          C_name: username,
          C_password: null, // Remember to hash the password before storing it
          C_email: email,
          C_gender: null,
          C_age: null,
          T_pnum: null, // Include T_pnum in the customer record
        },
      });

      res.status(201).json(newCustomer);
    }
  } catch (error) {
    console.error("Error during Google callback:", error);
    return res.status(401).json({ error: "Google login failed" });
  }
});

module.exports = router;
