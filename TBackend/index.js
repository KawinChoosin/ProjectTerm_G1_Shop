const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors'); // Add cors
const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json());


// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Database connection error' });
  }
});

// Add a product
app.post('/products', async (req, res) => {
  const { P_name, P_description, P_quantity, P_price, P_img, CG_id } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: {
        P_name,
        P_description,
        P_quantity,
        P_price,
        P_img,
        CG_id, // Ensure the category ID is provided
      },
    });
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
});

// Get products by category ID (e.g., Sport, Cloth, Electronic)
app.get('/products/category/:CG_id', async (req, res) => {
  const { CG_id } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: {
        CG_id: parseInt(CG_id, 10), // Convert CG_id to integer
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products by category' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Running the app
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
