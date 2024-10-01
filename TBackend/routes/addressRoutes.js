const express = require("express");
const prisma = require("../prisma/client");
const addressSchema = require("../schemas/addressSchema");
const { z } = require("zod");

const router = express.Router();

// Get all addresses for a customer
router.get("/:C_id", async (req, res) => {
  const { C_id } = req.params;
  try {
    const addresses = await prisma.address.findMany({
      where: {
        C_id: parseInt(C_id, 10),
      },
    });
    // Return addresses even if empty as an empty array
    res.status(200).json(addresses); // This will return [] if no addresses found
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Error fetching addresses" });
  }
});

// Get a specific address by ID
router.get("/address/:id", async (req, res) => {
  const addressId = parseInt(req.params.id, 10);
  try {
    const address = await prisma.address.findUnique({
      where: { A_id: addressId },
    });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json(address);
  } catch (error) {
    console.error("Error fetching address by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new address
router.post("/", async (req, res) => {
  try {
    const validatedData = addressSchema.parse(req.body);
    const newAddress = await prisma.address.create({
      data: validatedData,
    });
    res.status(201).json(newAddress); // Return 201 for created resources
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating address:", error);
    res.status(500).json({ error: "Error creating address" });
  }
});

// Update an existing address
router.patch("/:id", async (req, res) => {
  const addressId = parseInt(req.params.id, 10);
  try {
    const validatedData = addressSchema.omit({ C_id: true }).parse(req.body);
    const updatedAddress = await prisma.address.update({
      where: { A_id: addressId },
      data: validatedData,
    });
    res.json(updatedAddress);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Error updating address" });
  }
});

// Delete an address
router.delete("/:id", async (req, res) => {
  const addressId = parseInt(req.params.id, 10);
  try {
    const deletedAddress = await prisma.address.delete({
      where: { A_id: addressId },
    });
    res.json({ message: "Address successfully deleted", deletedAddress });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Error deleting address" });
  }
});

module.exports = router;
