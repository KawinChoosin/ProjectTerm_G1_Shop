// routes/cartRoutes.js
const express = require("express");
const prisma = require("../prisma/client");

const router = express.Router();

// Add product to cart
router.post("/add", async (req, res) => {
  const { C_id, P_id, CA_quantity, CA_price } = req.body;
  try {
    const existingCartDetail = await prisma.cartDetail.findUnique({
      where: {
        C_id_P_id: { C_id, P_id },
      },
    });

    if (existingCartDetail) {
      let existingCartPrice = parseFloat(existingCartDetail.CA_price);
      let newPrice = parseFloat(CA_price);
      let quantity = parseInt(CA_quantity, 10);
      const updatedCartDetail = await prisma.cartDetail.update({
        where: {
          C_id_P_id: { C_id, P_id },
        },
        data: {
          CA_quantity: existingCartDetail.CA_quantity + CA_quantity,
          CA_price: existingCartPrice + (newPrice * quantity),
        },
      });
      res.json(updatedCartDetail);
    } else {
      const newCartDetail = await prisma.cartDetail.create({
        data: {
          C_id,
          P_id,
          CA_quantity,
          CA_price: CA_price * CA_quantity,
        },
      });
      res.json(newCartDetail);
    }
  } catch (error) {
    res.status(500).json({ error: "Error adding product to cart" });
  }
});

// Delete product from cart
router.delete("/delete", async (req, res) => {
  const { C_id, P_id } = req.body;
  try {
    const deletedCartDetail = await prisma.cartDetail.delete({
      where: {
        C_id_P_id: { C_id: parseInt(C_id, 10), P_id: parseInt(P_id, 10) },
      },
    });
    res.json({
      message: "Item successfully deleted from cart",
      deletedCartDetail,
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting product from cart" });
  }
});

// Get all cart items for a specific customer
router.get("/:C_id", async (req, res) => {
  const { C_id } = req.params;
  try {
    const cartItems = await prisma.cartDetail.findMany({
      where: { C_id: parseInt(C_id, 10) },
      include: { Product: true },
    });
    // if (cartItems.length === 0) {
    //   return res.status(404).json({ message: "No items found in cart" });
    // }
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart items" });
  }
});

// Update product quantity in cart
router.patch("/update", async (req, res) => {
  const { C_id, P_id, CA_quantity, CA_price } = req.body;

  try {
    const updatedCartDetail = await prisma.cartDetail.update({
      where: {
        C_id_P_id: { C_id: parseInt(C_id, 10), P_id: parseInt(P_id, 10) }, // Composite primary key
      },
      data: {
        CA_quantity,
        CA_price: CA_price * CA_quantity, // Update total price accordingly
      },
    });
    res.json(updatedCartDetail);
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ error: "Error updating cart quantity" });
  }
});

module.exports = router;
