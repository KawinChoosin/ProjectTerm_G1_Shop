/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - C_id
 *         - C_name
 *         - C_email
 *         - T_pnum
 *         - C_gender
 *         - C_age
 *         - C_password
 *       properties:
 *         C_id:
 *           type: integer
 *         C_name:
 *           type: string
 *         C_email:
 *           type: string
 *           format: email
 *         T_pnum:
 *           type: string
 *         C_gender:
 *           type: string
 *         C_age:
 *           type: integer
 *         C_password:
 *           type: string
 * tags:
 *   - name: Customers
 *     description: Customer management API
 * 
 * /customers:
 *   get:
 *     summary: Get customer profile
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: C_id
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer profile retrieved successfully"
 *                 customers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *       '500':
 *         description: Error fetching Profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching customer profile"
 * 
 *   put:
 *     summary: Update customer profile
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: C_id
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - C_name
 *               - C_email
 *               - T_pnum
 *               - C_gender
 *               - C_age
 *             properties:
 *               C_name:
 *                 type: string
 *               C_email:
 *                 type: string
 *                 format: email
 *               T_pnum:
 *                 type: string
 *               C_gender:
 *                 type: string
 *               C_age:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer updated successfully"
 *       '400':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input data"
 *       '500':
 *         description: Error updating customer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error updating customer"
 * 
 * /customers/pass/{C_id}:
 *   put:
 *     summary: Update customer password
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: C_id
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - C_password
 *             properties:
 *               C_password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       '400':
 *         description: Password field is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Password field is required"
 *       '404':
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Customer not found"
 *       '500':
 *         description: Error updating password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error updating password"
 */


const express = require("express");
const prisma = require("../prisma/client");

const router = express.Router();

router.get("/", async (req, res) => {
    const { C_id } = req.query;
    try {
      const customer = await prisma.customer.findMany({
        where: {
          C_id: parseInt(C_id, 10),
        },
      });
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Error fetching Profile" });
    }
  });

  router.put('/pass/:C_id', async (req, res) => {
    const { C_id } = req.params;  // Change this line
    const { C_password } = req.body;
    
    try {
        // Validate the input
        if (!C_password) {
            return res.status(400).json({ error: "Password fields are required" });
        }

        // Update the user data in the Prisma database
        const updatedCustomer = await prisma.customer.update({
            where: {
                C_id: parseInt(C_id, 10),  // Convert ID to an integer
            },
            data: {
                C_password,
            },
        });

        res.status(200).json(updatedCustomer); // Return the updated user data
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ error: "Error updating customer" });
    }
});


router.put('/', async (req, res) => {

   const { C_id } = req.query;
    const { C_name, C_email, T_pnum, C_gender, C_age } = req.body;
  
    try {
      // Validate the input
      if (!C_name || !C_email || !T_pnum || !C_gender || !C_age) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Update the user data in the Prisma database
      const updatedCustomer = await prisma.customer.update({
        where: {
          C_id: parseInt(C_id, 10),  // Convert ID to an integer
        },
        data: {
          C_name,
          C_email,
          T_pnum,
          C_gender,
          C_age: parseInt(C_age, 10), // Convert age to an integer
        
        },
      });
  
      res.status(200).json(updatedCustomer); // Return the updated user data
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ error: "Error updating customer" });
    }
  });

module.exports = router;