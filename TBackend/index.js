const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
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
        P_price,  // Ensure that this is an integer
        P_img,
        CG_id,  // Ensure the category ID is provided
      },
    });
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
});

// Get products by category ID
app.get('/products/category/:CG_id', async (req, res) => {
  const { CG_id } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: {
        CG_id: parseInt(CG_id, 10),  // Ensure CG_id is treated as an integer
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products by category' });
  }
});

// Get a product by ID
app.get('/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id, 10);  // Ensure P_id is treated as an integer
  try {
    const product = await prisma.product.findUnique({
      where: {
        P_id: productId,  // P_id is now an integer
      },
      include: {
        Category: true,   // Include related category data
        Rate: true,       // Include related rates
        Comment: true,    // Include related comments
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error' });
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
