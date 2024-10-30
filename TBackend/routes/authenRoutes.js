/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - C_id
 *         - C_email
 *       properties:
 *         C_id:
 *           type: integer
 *         C_email:
 *           type: string
 *         C_name:
 *           type: string
 *         isOauth:
 *           type: boolean
 * tags:
 *   - name: Google Auth
 *     description: Google OAuth authentication API
 * 
 * /auth/google/callback:
 *   get:
 *     summary: Get all customers
 *     tags: [Google Auth]
 *     responses:
 *       '200':
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       '500':
 *         description: Database connection error
 * 
 *   post:
 *     summary: Handle Google OAuth callback
 *     tags: [Google Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful login or new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 C_id:
 *                   type: integer
 *                 C_email:
 *                   type: string
 *                 C_name:
 *                   type: string
 *                 isOauth:
 *                   type: boolean
 *       '400':
 *         description: Authorization code is missing
 *       '401':
 *         description: Google login failed
 *       '500':
 *         description: Server error
 */

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
