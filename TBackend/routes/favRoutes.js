/**
 * @swagger
 * components:
 *   schemas:
 *     Favourite:
 *       type: object
 *       required:
 *         - C_id
 *         - P_id
 *       properties:
 *         C_id:
 *           type: integer
 *         P_id:
 *           type: integer
 * 
 * tags:
 *   - name: Favourite
 *     description: Favourite management API
 * 
 * /favourites/{C_id}:
 *   get:
 *     summary: Get all favourite items for a specific customer
 *     tags: [Favourite]
 *     parameters:
 *       - in: path
 *         name: C_id
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A list of favorite items
 *       '500':
 *         description: Error fetching favorite items
 * 
 * /favourites/add:
 *   post:
 *     summary: Add product to favourites
 *     tags: [Favourite]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - C_id
 *               - P_id
 *             properties:
 *               C_id:
 *                 type: integer
 *               P_id:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Product added to favourites
 *       '400':
 *         description: Item already in favourites
 *       '500':
 *         description: Error adding product to favourites
 * 
 * /favourites/check/{P_id}:
 *   get:
 *     summary: Check if a product is in favourites for a specific customer
 *     tags: [Favourite]
 *     parameters:
 *       - in: path
 *         name: P_id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: C_id
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Check if product is liked
 *       '400':
 *         description: C_id is required
 *       '500':
 *         description: Error checking favorite status
 * 
 * /favourites/remove:
 *   delete:
 *     summary: Remove product from favourites
 *     tags: [Favourite]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - C_id
 *               - P_id
 *             properties:
 *               C_id:
 *                 type: integer
 *               P_id:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Item successfully removed from favourites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item successfully removed from favourites
 *                 removeItem:
 *                   $ref: '#/components/schemas/Favourite'
 *       '400':
 *         description: C_id and P_id are required
 *       '500':
 *         description: Error removing product from favourites
 */

const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");

// Get all favourite items for a specific customer
router.get("/:C_id", async (req, res) => {
  const { C_id } = req.params;

  try {
    const favItems = await prisma.favourite.findMany({
      where: {
        C_id: parseInt(C_id), // Ensure C_id is an integer
      },
      include: {
        Product: true,
      },
    });

    // You can return the favItems here, for example:
    res.json(favItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching favorite items." });
  }
});

// Add product to favourites
router.post("/add", async (req, res) => {
  const { C_id, P_id } = req.body;

  try {
    const existingFavItem = await prisma.favourite.findUnique({
      where: {
        C_id_P_id: { C_id, P_id }, // Composite primary key for favorites
      },
    });
    console.log(existingFavItem);
    if (existingFavItem) {
      return res.status(400).json({ error: "Item already in favourites" });
    } else {
      const newFavItem = await prisma.favourite.create({
        data: {
          C_id,
          P_id,
        },
      });
      res.json(newFavItem);
    }
  } catch (error) {
    console.error("Error adding product to favourites:", error);
    res.status(500).json({ error: "Error adding product to favourites" });
  }
});

// Check if a product is in favourites for a specific customer
router.get("/check/:P_id", async (req, res) => {
  const { C_id } = req.query; // Get C_id from query parameters
  const { P_id } = req.params;

  if (!C_id) {
    return res.status(400).json({ error: "C_id is required" });
  }

  try {
    const existingFavItem = await prisma.favourite.findUnique({
      where: {
        C_id_P_id: { C_id: parseInt(C_id), P_id: parseInt(P_id) }, // Composite primary key for favorites
      },
    });

    res.json({ isLiked: existingFavItem ? true : false });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    res.status(500).json({ error: "Error checking favorite status" });
  }
});

// Remove product from favourites
router.delete("/remove", async (req, res) => {
  const { C_id, P_id } = req.body;

  if (!C_id || !P_id) {
    return res.status(400).json({ error: "C_id and P_id are required" });
  }

  try {
    const removeItem = await prisma.favourite.delete({
      where: {
        C_id_P_id: { C_id, P_id },
      },
    });

    res.json({
      message: "Item successfully removed from favourites",
      removeItem,
    });
  } catch (error) {
    console.error("Error removing product from favourites:", error);
    res.status(500).json({ error: "Error removing product from favourites" });
  }
});

// Export router to be used in app.js or main server file
module.exports = router;
