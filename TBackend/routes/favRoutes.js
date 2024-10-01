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
