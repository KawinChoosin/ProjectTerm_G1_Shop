require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Static path for file serving

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define upload directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Unique filename generation
  }
});
const upload = multer({ storage: storage });

// POST route for creating a new product with file upload
// Ensure this route handles multipart/form-data
app.post('/products', upload.single('P_img'), async (req, res) => {
  try {
    // Extract data from request body
    const { P_name, P_description, P_price, P_quantity, CG_id } = req.body;

    // Make sure CG_id is parsed as an integer
    const selectedCategoryId = parseInt(CG_id, 10);

    // Check if selectedCategoryId is valid
    if (!selectedCategoryId) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    // Create the product with Prisma
    const newProduct = await prisma.product.create({
      data: {
        P_name,
        P_description,
        P_quantity: parseInt(P_quantity, 10),
        P_price: parseInt(P_price, 10),
        P_img: req.file.filename, // Assuming Multer is used for image upload
        Category: {
          connect: {
            CG_id: selectedCategoryId, // Use the parsed category ID
          },
        },
      },
    });

    res.status(200).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  }
});



// GET route for fetching all products
app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Database connection error' });
  }
});

// GET route for fetching products by category ID
app.get('/products/category/:CG_id', async (req, res) => {
  const { CG_id } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: {
        CG_id: parseInt(CG_id, 10),  // Ensure CG_id is an integer
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products by category' });
  }
});

// GET route for fetching a product by ID
app.get('/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id, 10);  // Ensure P_id is treated as an integer
  try {
    const product = await prisma.product.findUnique({
      where: {
        P_id: productId,
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
