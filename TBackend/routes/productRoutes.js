// routes/productRoutes.js
const express = require("express");
const prisma = require("../prisma/client");
const multer = require('multer');
const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Database connection error" });
  }
});

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

// // Add a product
// router.post("/", async (req, res) => {
//   const { P_name, P_description, P_quantity, P_price, P_img, CG_id } = req.body;
//   try {
//     const newProduct = await prisma.product.create({
//       data: {
//         P_name,
//         P_description,
//         P_quantity,
//         P_price,
//         P_img,
//         CG_id,
//       },
//     });
//     res.json(newProduct);
//   } catch (error) {
//     res.status(500).json({ error: "Error creating product" });
//   }
// });

router.post('/', upload.single('P_img'), async (req, res) => {
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

// Get products by category ID
router.get("/category/:CG_id", async (req, res) => {
  const { CG_id } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: { CG_id: parseInt(CG_id, 10) },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products by category" });
  }
});

// Get a product by ID
router.get("/:id", async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  try {
    const product = await prisma.product.findUnique({
      where: { P_id: productId },
      include: {
        Category: true,
        Rate: true,
        Comment: true,
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Check stock of a product by ID
router.get("/check-stock/:id", async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  try {
    const product = await prisma.product.findUnique({
      where: { P_id: productId },
      select: { P_quantity: true }, 
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return the product's quantity
    res.json({ P_quantity: product.P_quantity });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put('/:id', upload.single('P_img'), async (req, res) => {
  const productId = parseInt(req.params.id, 10);

  try {
      const { P_name, P_description, P_price, P_quantity, CG_id } = req.body;

      const updatedData = {
          P_name,
          P_description,
          P_price: parseFloat(P_price), // Ensure price is a float
          P_quantity: parseInt(P_quantity, 10), // Ensure quantity is an integer
          CG_id: parseInt(CG_id, 10),
      };

      // Update image if provided
      if (req.file) {
          updatedData.P_img = req.file.filename; // Save new image filename
      }

      const updatedProduct = await prisma.product.update({
          where: { P_id: productId },
          data: updatedData,
      });

      res.status(200).json(updatedProduct);
  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Error updating product' });
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  try {
    const deletedProduct = await prisma.product.delete({
      where: { P_id: productId },
    });
    res.status(200).json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;

