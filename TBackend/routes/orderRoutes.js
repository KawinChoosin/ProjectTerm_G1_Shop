const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const _ = require("lodash");
const QRCode = require("qrcode");
const generatePayload = require("promptpay-qr");
const upload = require("../upload");
const {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} = require("date-fns");

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
        order.Payment.PM_path = `http://localhost:3000/${order.Payment.PM_path}`;
      }
    });
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer" });
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

// Add a new order
// router.post("/", async (req, res) => {
//   const { C_id, Date_time, Total, PM_type, PM_amount, A_id, O_Description, Payslip, orderDetails } = req.body;

//   try {
//     const paymentMethod = await prisma.payment.create({
//       data: {
//         PM_amount: parseFloat(PM_amount),
//         PM_type: PM_type,
//         Date_time: new Date(Date_time), // Ensure the date format is correct
//       },
//     });

//     // Create the new order with the payment method
//     const newOrder = await prisma.order.create({
//       data: {
//         C_id: parseInt(C_id, 10),
//         Q_Date_time: new Date(Date_time),
//         O_Total: parseFloat(Total),
//         PM_id: paymentMethod.PM_id,
//         A_id: parseInt(A_id, 10), // Address ID
//         O_Description: O_Description || null,
//         Payslip: Payslip,
//         OrderDetail: {
//           create: orderDetails.map((detail) => ({
//             P_id: parseInt(detail.P_id, 10),
//             OD_quantity: parseInt(detail.OD_quantity, 10),
//             OD_price: parseFloat(detail.OD_price),
//           })),
//         },
//       },
//     });

//     res.status(201).json(newOrder);
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ error: "Error creating order" });
//   }
// });

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

    // Start a transaction
    const transaction = await prisma.$transaction(async (prisma) => {
      // Create the payment record
      const paymentMethod = await prisma.payment.create({
        data: {
          PM_amount: parseFloat(PM_amount),
          Date_time: new Date(Date_time),
          PM_path,
        },
      });

      // Create the new order with the payment method
      const newOrder = await prisma.order.create({
        data: {
          C_id: parseInt(C_id, 10),
          O_Date_time: new Date(Date_time),
          O_Total: parseFloat(Total),
          PM_id: paymentMethod.PM_id,
          A_id: parseInt(A_id, 10),
          O_Description: O_Description || null,
          OrderDetail: {
            create: orderDetails.map((detail, index) => {
              // Validate and ensure valid quantity
              const quantity = parseInt(detail.OD_quantity, 10);
              if (isNaN(quantity) || quantity <= 0) {
                throw new Error(`Invalid quantity for order detail at index ${index}`);
              }
      
              // Ensure product price is a number
              const productPrice = parseFloat(detail.OD_product_price);
              if (isNaN(productPrice)) {
                throw new Error(`Invalid product price for order detail at index ${index}`);
              }
      
              return {
                P_id: parseInt(detail.P_id, 10),
                OD_quantity: quantity,
                OD_price: parseFloat(detail.OD_price),
                OD_product_name: detail.OD_product_name,
                OD_product_price: productPrice,
              };
            }),
          },
        },
        include: {
          OrderDetail: {
            include: {
              Product: true,
            },
          },
        },
      });
      

      const createdOrderDetails = newOrder.OrderDetail;

      // Update product quantities
      for (const detail of createdOrderDetails) {
        const productId = detail.P_id;
        const orderedQuantity = detail.OD_quantity;

        await prisma.product.update({
          where: { P_id: productId },
          data: {
            P_quantity: {
              decrement: orderedQuantity,
            },
          },
        });
      }

      return newOrder;
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating order and payment:", error.message);
    res.status(500).json({ error: error.message });
  }
});





// Add a new order detail
router.post("/orderdetails", async (req, res) => {
  const { O_id, P_id, OD_quantity, OD_price, OD_product_name, OD_product_price } = req.body;

  try {
    const newOrderDetail = await prisma.orderDetail.create({
      data: {
        O_id: parseInt(O_id, 10),
        P_id: parseInt(P_id, 10),
        OD_quantity: parseInt(OD_quantity, 10),
        OD_price: parseFloat(OD_price),
        OD_product_name,  // Store product name at the time of order
        OD_product_price: parseFloat(OD_product_price), // Store product price at the time of order
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

router.get("/sum/weekly-summary", async (req, res) => {
  try {
    // Get the start and end of the current week (assuming week starts on Monday)
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    // Query the database for orders within this week, grouped by date
    const orders = await prisma.order.groupBy({
      by: ["O_Date_time"],
      _sum: { O_Total: true },
      _count: { O_id: true },
      where: {
        O_Date_time: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    // Format the results by each day of the week
    const daysOfWeek = eachDayOfInterval({
      start: weekStart,
      end: weekEnd,
    }).map((date) => ({
      date: format(date, "yyyy-MM-dd"),
      totalSum: 0,
      orderCount: 0,
    }));

    // Fill in the actual order data into the formatted results
    orders.forEach((order) => {
      const orderDate = format(order.O_Date_time, "yyyy-MM-dd");
      const dayEntry = daysOfWeek.find((day) => day.date === orderDate);
      if (dayEntry) {
        dayEntry.totalSum = order._sum.O_Total || 0;
        dayEntry.orderCount = order._count.O_id || 0;
      }
    });

    res.json({
      weekStart: format(weekStart, "yyyy-MM-dd"),
      weekEnd: format(weekEnd, "yyyy-MM-dd"),
      days: daysOfWeek,
    });
  } catch (error) {
    console.error("Error fetching weekly order summary:", error);
    res.status(500).json({ error: "Error fetching weekly order summary" });
  }
});

// getting sales by hour
router.get("/total-sales-by-hour", async (req, res) => {
  try {
    const salesData = await db.query(`
          SELECT DATE_TRUNC('hour', O_Date_time) AS hour, SUM(O_Total) AS totalSales
          FROM orders
          WHERE O_Date_time >= CURRENT_DATE -- Adjust this as necessary
          GROUP BY hour
          ORDER BY hour
      `);

    const formattedData = salesData.rows.map((row) => ({
      hour: row.hour.toISOString().substring(11, 16), // Get hour in HH:MM format
      totalSales: parseFloat(row.totalSales) || 0, // Ensure totalSales is a number
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching total sales by hour:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get monthly sales data
router.get("/total-sales-month", async (req, res) => {
  try {
    const monthlySales = await prisma.order.groupBy({
      by: [
        {
          // Assuming O_Date_time is the date field in your Order table
          _month: {
            O_Date_time: true,
          },
        },
      ],
      _sum: {
        O_Total: true, // This should be the field containing sales amounts
      },
      orderBy: {
        _month: "asc", // Order by month ascending
      },
    });

    // Format the data to map month index to its name and total sales
    const monthlySalesData = monthlySales.map((sale) => {
      const monthIndex = new Date(sale._month).getMonth(); // Get month index (0-11)
      return {
        month: monthNames[monthIndex], // monthNames is an array of month names
        totalSales: sale._sum.O_Total || 0, // Use 0 if no sales
      };
    });

    res.json(monthlySalesData);
  } catch (error) {
    console.error("Error fetching monthly sales data:", error);
    res.status(500).json({ error: "Error fetching monthly sales data" });
  }
});

module.exports = router;
