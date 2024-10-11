const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const prisma = require("../prisma/client");
const router = express.Router();
const client = new OAuth2Client(
  process.env.GOOGLE_CID,
  process.env.GOOGLE_CS,
  `${process.env.FE_BASE_URL}/auth/google/callback`
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
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing." });
  }

  try {
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CID,
    });

    const payload = ticket.getPayload();
    const username = payload.name.replace(/\s+/g, "");
    const email = payload.email;

    const user = await prisma.customer.findMany({ where: { C_email: email } });

    if (user.length > 0) {
      return res.json({ C_id: user[0].C_id, C_email: email });
    } else {
      // New user, redirect with OAuth flag and user data
      return res.json({ C_name: username, C_email: email, isOauth: true });
    }
  } catch (error) {
    console.error("Error during Google callback:", error);
    return res.status(401).json({ error: "Google login failed" });
  }
});

module.exports = router;
