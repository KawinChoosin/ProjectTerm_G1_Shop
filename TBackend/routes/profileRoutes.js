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