const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const _ = require("lodash");
const QRCode = require("qrcode");
const generatePayload = require("promptpay-qr");
const upload = require("../upload");
const { startOfWeek, endOfWeek, format } = require("date-fns");

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
        order.Payment.PM_path = `${process.env.API_BASE_URL}/${order.Payment.PM_path}`;
      }
    });
    // if (orders.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "No orders found for this customer" });
    // }

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
        Address: true,
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
    res.status(500).json({ message: "Server error!!!!!!!!!" });
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
    res.status(500).json({ message: "Server error!" });
  }
});

router.post("/", upload.single("slip"), async (req, res) => {
  const {
    C_id,
    Date_time,
    Total,
    PM_amount,
    A_id,
    PM_path,
    O_Description,
    orderDetails,
  } = req.body;

  // Check if the file was uploaded successfully
  if (!PM_path) {
    return res.status(400).json({ error: "Payslip upload is required." });
  }

  try {
    // Ensure orderDetails is an array
    if (!Array.isArray(orderDetails)) {
      return res.status(400).json({ error: "orderDetails must be an array." });
    }

    // Convert Date_time to UTC from UTC+07:00
    const localDate = new Date(Date_time); // Local date from user input (assumed UTC+07:00)
    const utc7Date = new Date(localDate.getTime() + 7 * 60 * 60 * 1000); // Adjust by 7 hours to convert to UTC

    // Start a transaction
    const transaction = await prisma.$transaction(async (prisma) => {
      // Create the payment record
      const paymentMethod = await prisma.payment.create({
        data: {
          PM_amount: parseFloat(PM_amount),
          Date_time: utc7Date, // Store the UTC+07:00 adjusted date as UTC
          PM_path, // Store the uploaded file path
        },
      });

      // Create the new order with the payment method
      const newOrder = await prisma.order.create({
        data: {
          C_id: parseInt(C_id, 10),
          O_Date_time: utc7Date, // Store the UTC+07:00 adjusted date as UTC
          O_Total: parseFloat(Total),
          PM_id: paymentMethod.PM_id, // Link to payment
          A_id: parseInt(A_id, 10), // Address ID
          O_Description: O_Description || null,
          OrderDetail: {
            create: orderDetails.map((detail) => ({
              P_id: parseInt(detail.P_id, 10),
              OD_quantity: parseInt(detail.OD_quantity, 10),
              OD_price: parseFloat(detail.OD_price),
            })),
          },
        },
      });

      // Update product quantities
      for (const detail of orderDetails) {
        const productId = parseInt(detail.P_id, 10);
        const orderedQuantity = parseInt(detail.OD_quantity, 10);

        // Decrease the product quantity
        await prisma.product.update({
          where: { P_id: productId },
          data: {
            P_quantity: {
              decrement: orderedQuantity,
            },
          },
        });
      }

      return newOrder; // Return the new order as the result of the transaction
    });

    res.status(201).json(transaction); // Respond with the created order
  } catch (error) {
    console.error("Error creating order and payment:", error);
    res.status(500).json({ error: "Error creating order and payment" });
  }
});

// Add a new order detail
router.post("/orderdetails", async (req, res) => {
  const { O_id, P_id, OD_quantity, OD_price } = req.body;

  try {
    const newOrderDetail = await prisma.orderDetail.create({
      data: {
        O_id: parseInt(O_id, 10),
        P_id: parseInt(P_id, 10),
        OD_quantity: parseInt(OD_quantity, 10),
        OD_price: parseFloat(OD_price),
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
        O_Total: parseFloat(Total),
        OrderDetail: {
          deleteMany: {}, // Clear previous order details
          create: orderDetails.map((detail) => ({
            P_id: parseInt(detail.P_id, 10),
            OD_quantity: parseInt(detail.OD_quantity, 10),
            OD_price: parseFloat(detail.OD_price),
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

// Generate QR code
router.post("/generateQR", (req, res) => {
  const amount = parseFloat(_.get(req, ["body", "amount"]));
  const mobileNumber = "0980798171";
  const payload = generatePayload(mobileNumber, { amount });
  const option = {
    color: {
      dark: "#000",
      light: "#fff",
    },
  };
  QRCode.toDataURL(payload, option, (err, url) => {
    if (err) {
      console.log("generate fail");
      return res.status(400).json({
        RespCode: 400,
        RespMessage: "bad : " + err,
      });
    } else {
      return res.status(200).json({
        RespCode: 200,
        RespMessage: "good",
        Result: url,
      });
    }
  });
});

// router.post('/payments', upload.single('slip'), async (req, res) => {
//   try {
//     const { PM_amount, Date_time } = req.body;

//     // Get the uploaded file path
//     const PM_path = req.file ? req.file.path : '';

//     // Create the payment record
//     const newPayment = await prisma.payment.create({
//       data: {
//         PM_amount: parseFloat(PM_amount),
//         PM_path, // Store the file path
//         Date_time: new Date(Date_time),
//       },
//     });

//     res.status(201).json(newPayment);
//   } catch (error) {
//     res.status(500).json({ error: 'Error creating payment' });
//   }
// });

// Payment Upload and Link to an Order

// router.post('/payments', upload.single('slip'), async (req, res) => {
//   try {
//     const { PM_amount, Date_time, O_id } = req.body;

//     // Ensure that an amount and order ID are provided
//     if (!PM_amount || !O_id) {
//       return res.status(400).json({ error: 'Payment amount and Order ID are required.' });
//     }

//     // Get the uploaded file path
//     const PM_path = req.file ? req.file.path : '';

//     // Check if the file was uploaded successfully
//     if (!PM_path) {
//       return res.status(400).json({ error: 'Payslip upload is required.' });
//     }

//     // Create the payment record and link it to an order (assumes `O_id` is the order identifier)
//     const newPayment = await prisma.payment.create({
//       data: {
//         PM_amount: parseFloat(PM_amount), // Convert amount to float if it's a string
//         PM_path,                          // Store the uploaded file path
//         Date_time: new Date(Date_time),    // Use provided date or the current date
//         Order: {                           // Link payment to the order
//           connect: { O_id: parseInt(O_id) },  // Assuming `O_id` is the field for order ID in your Prisma schema
//         },
//       },
//     });

//     // Send a success response with the new payment record
//     res.status(201).json(newPayment);
//   } catch (error) {
//     console.error('Error creating payment:', error);
//     res.status(500).json({ error: 'Error creating payment' });
//   }
// });

router.get("/chart/total-sales-week", async (req, res) => {
  try {
    // Get the start and end of the current week (assuming the week starts on Monday)
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday end

    // Fetch all orders within the week from the database
    const orders = await prisma.order.findMany({
      where: {
        O_Date_time: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      orderBy: {
        O_Date_time: "asc", // Sort orders by date (ascending)
      },
    });

    // Return the full list of orders within the week
    res.json({
      weekStart: format(weekStart, "yyyy-MM-dd"),
      weekEnd: format(weekEnd, "yyyy-MM-dd"),
      orders, // Send all orders directly without grouping
    });
  } catch (error) {
    console.error("Error fetching weekly orders:", error);
    res.status(500).json({ error: "Error fetching weekly orders" });
  }
});

module.exports = router;
