/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         O_id:
 *           type: integer
 *         O_Description:
 *           type: string
 *         O_status:
 *           type: string
 *         Customer:
 *           type: object
 *           properties:
 *             C_name:
 *               type: string
 *         Payment:
 *           type: object
 *           properties:
 *             PM_path:
 *               type: string
 *         Address:
 *           type: object
 *         OrderDetail:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               Product:
 *                 type: object
 * 
 * tags:
 *   - name: Orders
 *     description: Order management API
 * 
 * /orders/descrip:
 *   put:
 *     summary: Update order description and status
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *     responses:
 *       '200':
 *         description: Order updated successfully
 *       '400':
 *         description: Bad request for missing fields or invalid status
 *       '500':
 *         description: Error updating order
 * 
 * /orders/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *     responses:
 *       '200':
 *         description: Order status updated successfully
 *       '400':
 *         description: Bad request for missing fields
 *       '500':
 *         description: Error updating order
 * 
 * /orders/customer:
 *   get:
 *     summary: Get all orders for a specific customer
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: C_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of orders for the customer
 *       '500':
 *         description: Error fetching orders
 */

const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");

router.put("/descrip", async (req, res) => {
  const { O_id, O_Description, O_status } = req.body;

  if (!O_id) {
    return res.status(400).json({ message: "Missing O_id" });
  }

  // Ensure O_status is one of the allowed enum values
  const validStatuses = ["DEFAULT", "SUCCESS", "ERROR"];
  if (O_status && !validStatuses.includes(O_status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const updateDescrib = await prisma.order.update({
      where: {
        O_id: parseInt(O_id, 10),
      },
      data: {
        O_Description,
        O_status: O_status || "DEFAULT", // Default to 'DEFAULT' if not provided
      },
    });
    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order", error });
  }
});

router.put("/status", async (req, res) => {
  const { O_id, O_status } = req.body;

  if (!O_id) {
    return res.status(400).json({ message: "Missing O_id" });
  }

  try {
    const updateDescrib = await prisma.order.update({
      where: {
        O_id: parseInt(O_id, 10),
      },
      data: {
        O_status,
      },
    });
    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order", error });
  }
});

// Get all orders for a customer
router.get("/customer", async (req, res) => {
  const { C_id } = req.params;
  try {
    const orders = await prisma.order.findMany({
      where: {
        /* your condition here */
      },
      include: {
        Customer: true,
        Payment: true,
        Address: true,
        OrderDetail: {
          include: {
            Product: true,
          },
        },
      },
    });

    orders.forEach((order) => {
      if (order.Payment && order.Payment.PM_path) {
        order.Payment.PM_path = `api/${order.Payment.PM_path}`;
      }
    });
    // if (orders.length === 0) {
    //   return res.status(404).json({ message: "No orders found for this customer" });
    // }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

module.exports = router;
