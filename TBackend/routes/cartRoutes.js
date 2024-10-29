/**
 * @swagger
 * components:
 *   schemas:
 *     CartDetail:
 *       type: object
 *       required:
 *         - C_id
 *         - P_id
 *         - CA_quantity
 *         - CA_price
 *       properties:
 *         C_id:
 *           type: integer
 *         P_id:
 *           type: integer
 *         CA_quantity:
 *           type: integer
 *         CA_price:
 *           type: number
 *           format: float
 * tags:
 *   - name: Cart
 *     description: Cart management API
 * 
 * /cart/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - C_id
 *               - P_id
 *               - CA_quantity
 *               - CA_price
 *             properties:
 *               C_id:
 *                 type: integer
 *               P_id:
 *                 type: integer
 *               CA_quantity:
 *                 type: integer
 *               CA_price:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Product added to cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartDetail'
 *       '500':
 *         description: Error adding product to cart
 * 
 * /cart/delete:
 *   delete:
 *     summary: Delete product from cart
 *     tags: [Cart]
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
 *         description: Item successfully deleted from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item successfully deleted from cart
 *                 deletedCartDetail:
 *                   $ref: '#/components/schemas/CartDetail'
 *       '500':
 *         description: Error deleting product from cart
 * 
 * /cart/{C_id}:
 *   get:
 *     summary: Get all cart items for a specific customer
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: C_id
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A list of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartDetail'
 *       '500':
 *         description: Error fetching cart items
 * 
 * /cart/update:
 *   patch:
 *     summary: Update product quantity in cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - C_id
 *               - P_id
 *               - CA_quantity
 *               - CA_price
 *             properties:
 *               C_id:
 *                 type: integer
 *               P_id:
 *                 type: integer
 *               CA_quantity:
 *                 type: integer
 *               CA_price:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Cart quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartDetail'
 *       '500':
 *         description: Error updating cart quantity
 */

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
          CA_price: existingCartPrice + newPrice * quantity,
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
