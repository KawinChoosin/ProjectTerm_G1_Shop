const express = require("express");
const prisma = require("../prisma/client");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Database connection error" });
  }
});

// Add a Customer
router.post("/", async (req, res) => {
  const { C_name, C_password, C_email, C_gender, C_age, T_pnum } = req.body; // Include T_pnum

  try {
    // Check if customer with the same C_name or C_email already exists
    const existingCustomer = await prisma.customer.findMany({
      where: {
        OR: [
          { C_name },
          { C_email },
        ],
      },
    });

    if (existingCustomer.length > 0) {
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
        C_id,
        C_name,
        C_password, // Remember to hash the password before storing it
        C_email,
        C_gender,
        C_age: age,
        T_pnum, // Include T_pnum in the customer record
      },
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Error creating customer" });
  }
});

// Delete a Customer
router.delete("/register/:C_id", async (req, res) => {
  const { C_id } = req.params;
  console.log(`Received DELETE request for C_id: ${C_id}`);

  try {
    await prisma.cartDetail.deleteMany({
      where: { C_id: parseInt(C_id, 10) },
    });

    const deletedCustomer = await prisma.customer.delete({
      where: { C_id: parseInt(C_id, 10) },
    });

    res.json(deletedCustomer);
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(400).json({
        error: "Cannot delete customer due to foreign key constraints.",
      });
    }
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Error deleting customer" });
  }
});

module.exports = router;
