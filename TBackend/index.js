const express = require("express");
const { v4: uuidv4 } = require("uuid"); // Import UUID library
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const prisma = new PrismaClient();
// app.js
const bodyParser = require("body-parser");
const addressRoutes = require("./routes/addressRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Database connection error" });
  }
});

// Add a product
app.post("/products", async (req, res) => {
  const { P_name, P_description, P_quantity, P_price, P_img, CG_id } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: {
        P_name,
        P_description,
        P_quantity,
        P_price, // Ensure that this is an integer
        P_img,
        CG_id, // Ensure the category ID is provided
      },
    });
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
});

// Get products by category ID
app.get("/products/category/:CG_id", async (req, res) => {
  const { CG_id } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: {
        CG_id: parseInt(CG_id, 10), // Ensure CG_id is treated as an integer
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products by category" });
  }
});

// Get a product by ID
app.get("/products/:id", async (req, res) => {
  const productId = parseInt(req.params.id, 10); // Ensure P_id is treated as an integer
  try {
    const product = await prisma.product.findUnique({
      where: {
        P_id: productId, // P_id is now an integer
      },
      include: {
        Category: true, // Include related category data
        Rate: true, // Include related rates
        Comment: true, // Include related comments
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/register", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Database connection error" });
  }
});

// Add a Customer
app.post("/register", async (req, res) => {
  const { C_name, C_password, C_email, C_gender, C_age } = req.body;

  try {
    // Check if customer with the same C_name or C_email already exists
    const existingCustomer = await prisma.customer.findMany({
      where: {
        OR: [
          { C_name }, // Check for existing C_name
          { C_email }, // Check for existing C_email
        ],
      },
    });

    if (existingCustomer.length > 0) {
      // Prepare error messages based on what already exists
      const errors = [];
      if (existingCustomer.some((customer) => customer.C_name === C_name)) {
        errors.push("Customer with this name already exists.");
      }
      if (existingCustomer.some((customer) => customer.C_email === C_email)) {
        errors.push("Customer with this email already exists.");
      }
      return res.status(409).json({ error: errors.join(" ") });
    }

    function uuidToInteger() {
      const uuid = uuidv4().replace(/-/g, ""); // Remove dashes
      return parseInt(uuid.slice(0, 15), 16) % 2147483647; // Convert the first 15 hex digits to integer
    }

    const C_id = uuidToInteger();
    const age = parseInt(C_age, 10);

    // Create new customer record
    const newCustomer = await prisma.customer.create({
      data: {
        C_id, // UUID for customer ID
        C_name,
        C_password, // You should hash the password before storing it (for security)
        C_email,
        C_gender,
        C_age: age,
      },
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Error creating customer" });
  }
});

// Delete a Customer
app.delete("/register/:C_id", async (req, res) => {
  const { C_id } = req.params;
  console.log(`Received DELETE request for C_id: ${C_id}`);

  try {
    // First, delete all related CartDetail records for the customer
    await prisma.cartDetail.deleteMany({
      where: { C_id: parseInt(C_id, 10) },
    });

    // Then, delete the customer
    const deletedCustomer = await prisma.customer.delete({
      where: { C_id: parseInt(C_id, 10) },
    });

    res.json(deletedCustomer); // Return the deleted customer data
  } catch (error) {
    if (error.code === "P2003") {
      // Foreign key constraint error
      return res.status(400).json({
        error: "Cannot delete customer due to foreign key constraints.",
      });
    }
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Error deleting customer" });
  }
});

const jwt = require("jsonwebtoken");

// Define a secret key for JWT (you should store this securely in an environment variable)
const JWT_SECRET = "your_jwt_secret_key"; // Change this to a strong secret key

app.post("/login", async (req, res) => {
  const { C_name, C_password } = req.body;

  try {
    // Find user by username
    const users = await prisma.customer.findMany({
      where: { C_name },
    });

    // Check if the user exists
    if (!users || users.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = users[0]; // Get the first user from the array

    // Check if password is defined and matches
    if (user.C_password === undefined || user.C_password !== C_password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // If login is successful, generate a token
    const token = jwt.sign(
      { C_id: user.C_id, C_name: user.C_name },
      JWT_SECRET,
      {
        expiresIn: "1h", // Token will expire in 1 hour
      }
    );

    return res.json({
      message: "Login successful",
      token, // Send the token back to the client
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Use the modular routes
app.use("/address", addressRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
