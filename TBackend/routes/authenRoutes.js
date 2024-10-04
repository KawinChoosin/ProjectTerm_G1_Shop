const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const prisma = require("../prisma/client");
const router = express.Router();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
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
  console.log(code);
  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing." });
  }
  try {
    // Exchange the authorization code for tokens
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;
    console.log("Tokens received:", tokens); // Log tokens

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // Check if the user exists in the database
    const user = await prisma.customer.findMany({ where: { C_email: email } });

    if (user) {
      return res.json({ C_id: user[0].C_id, C_email: email });
    } else {
      return res.json({ email });
    }
  } catch (error) {
    console.error("Error during Google callback:", error);
    return res.status(401).json({ error: "Google login failed" });
  }
});

module.exports = router;
