/**
* @swagger
* components:
*   schemas:
*     Address:
*       type: object
*       required:
*         - A_id
*         - C_id
*         - A_name
*         - A_phone
*         - A_street
*         - A_city
*         - A_state
*         - A_postalCode
*         - A_country
*       properties:
*         A_id:
*           type: string
*         C_id:
*           type: integer
*         A_name:
*           type: string
*         A_phone:
*           type: string
*         A_street:
*           type: string
*         A_city:
*           type: string
*         A_state:
*           type: string
*         A_postalCode:
*           type: string
*         A_country:
*           type: string
*/
/**
* @swagger
* tags:
*   - name: Address
*     description: The address managing API
*
* /addresses/{C_id}:
*   get:
*     summary: Get all addresses for a customer
*     tags: [Address]
*     parameters:
*       - name: C_id
*         in: path
*         required: true
*         description: The ID of the customer
*         schema:
*           type: integer
*     responses:
*       '200':
*         description: A list of addresses
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Address'
*       '500':
*         description: Server error
*
* /addresses/address/{id}:
*   get:
*     summary: Get a specific address by ID
*     tags: [Address]
*     parameters:
*       - name: id
*         in: path
*         required: true
*         description: The ID of the address
*         schema:
*           type: integer
*     responses:
*       '200':
*         description: Address object
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Address'
*       '404':
*         description: Address not found
*       '500':
*         description: Server error
*
* /addresses:
*   post:
*     summary: Add a new address
*     tags: [Address]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Address'
*     responses:
*       '201':
*         description: Address created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Address'
*       '400':
*         description: Validation error
*       '500':
*         description: Server error
*
* /addresses/{id}:
*   patch:
*     summary: Update an existing address
*     tags: [Address]
*     parameters:
*       - name: id
*         in: path
*         required: true
*         description: The ID of the address to update
*         schema:
*           type: integer
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Address'
*     responses:
*       '200':
*         description: Updated address
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Address'
*       '400':
*         description: Validation error
*       '404':
*         description: Address not found
*       '500':
*         description: Server error
*
* /addresses/{id}/delete:
*   delete:
*     summary: Delete an address
*     tags: [Address]
*     parameters:
*       - name: id
*         in: path
*         required: true
*         description: The ID of the address to delete
*         schema:
*           type: integer
*     responses:
*       '200':
*         description: Address successfully deleted
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 deletedAddress:
*                   $ref: '#/components/schemas/Address'
*       '404':
*         description: Address not found
*       '500':
*         description: Server error
*/
 

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
