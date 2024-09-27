const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all orders for a customer
router.get("/customer/:C_id", async (req, res) => {
  const { C_id } = req.params;
  try {
    const orders = await prisma.order.findMany({
      where: {
        C_id: parseInt(C_id, 10),
      },
      include: {
        Customer: true,
        Payment: true,
        OrderDetail: {
          include: {
            Product: true, // Include the Product model to get product details
          },
        },
      },
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this customer" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
});


// Get a specific order by ID
router.get("/:O_id", async (req, res) => {
  const orderId = parseInt(req.params.O_id, 10);
  try {
    const order = await prisma.order.findUnique({
      where: { O_id: orderId },
      include: {
        Customer: true,
        Payment: true,
        OrderDetail: {
          include: {
            Product: true, // Include the Product model
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get order details by order ID
router.get("/orderdetails/:O_id", async (req, res) => {
  const orderId = parseInt(req.params.O_id, 10);
  try {
    const orderDetails = await prisma.orderDetail.findMany({
      where: { O_id: orderId },
      include: {
        Product: true,
        Order: true,
      },
    });

    if (orderDetails.length === 0) {
      return res
        .status(404)
        .json({ message: "No order details found for this order" });
    }

    res.json(orderDetails);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new order
router.post("/", async (req, res) => {
  const { C_id, Date_time, Total, PM_type, PM_amount, orderDetails } = req.body;

  try {
    paymentMethod = await prisma.payment.create({
      data: {
        PM_amount: PM_amount,
        PM_type: PM_type,
        Date_time: new Date(Date_time), // Use the appropriate date format
      },
    });

    // Create the new order with the payment method
    const newOrder = await prisma.order.create({
      data: {
        C_id: parseInt(C_id, 10),
        Date_time: new Date(Date_time),
        Total: parseInt(Total, 10),
        PM_id: paymentMethod.PM_id, // Link the new or existing payment method
        OrderDetail: {
          create: orderDetails.map((detail) => ({
            P_id: detail.P_id,
            OD_quantity: detail.OD_quantity,
            OD_price: detail.OD_price,
          })),
        },
      },
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
});

// Add a new order detail
router.post("/orderdetails", async (req, res) => {
  const { O_id, P_id, OD_quantity, OD_price } = req.body;

  try {
    const newOrderDetail = await prisma.orderDetail.create({
      data: {
        O_id: parseInt(O_id, 10), // Order ID
        P_id: parseInt(P_id, 10), // Product ID
        OD_quantity: parseInt(OD_quantity, 10), // Quantity
        OD_price: parseFloat(OD_price), // Price
      },
    });

    res.status(201).json(newOrderDetail);
  } catch (error) {
    console.error("Error creating order detail:", error);
    res.status(500).json({ error: "Error creating order detail" });
  }
});

// Update an existing order
router.patch("/:O_id", async (req, res) => {
  const orderId = parseInt(req.params.O_id, 10);
  const { Total, orderDetails } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { O_id: orderId },
      data: {
        Total: parseInt(Total, 10),
        OrderDetail: {
          deleteMany: {},
          create: orderDetails.map((detail) => ({
            P_id: detail.P_id,
            OD_quantity: detail.OD_quantity,
            OD_price: detail.OD_price,
          })),
        },
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Error updating order" });
  }
});

// Delete an order
router.delete("/:O_id", async (req, res) => {
  const orderId = parseInt(req.params.O_id, 10);
  try {
    const deletedOrder = await prisma.order.delete({
      where: {
        O_id: orderId,
      },
    });

    res.json({ message: "Order successfully deleted", deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Error deleting order" });
  }
});

module.exports = router;
