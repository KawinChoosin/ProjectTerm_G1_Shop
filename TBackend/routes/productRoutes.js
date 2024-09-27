// routes/productRoutes.js
const express = require("express");
const prisma = require("../prisma/client");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Database connection error" });
  }
});

// Add a product
router.post("/", async (req, res) => {
  const { P_name, P_description, P_quantity, P_price, P_img, CG_id } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: {
        P_name,
        P_description,
        P_quantity,
        P_price,
        P_img,
        CG_id,
      },
    });
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
});

// Get products by category ID
router.get("/category/:CG_id", async (req, res) => {
  const { CG_id } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: { CG_id: parseInt(CG_id, 10) },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products by category" });
  }
});

// Get a product by ID
router.get("/:id", async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  try {
    const product = await prisma.product.findUnique({
      where: { P_id: productId },
      include: {
        Category: true,
        Rate: true,
        Comment: true,
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
