/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - P_id
 *         - P_name
 *         - P_description
 *         - P_quantity
 *         - P_price
 *         - P_img
 *         - CG_id
 *       properties:
 *         P_id:
 *           type: integer
 *         P_name:
 *           type: string
 *         P_description:
 *           type: string
 *         P_quantity:
 *           type: integer
 *         P_price:
 *           type: number
 *           format: float
 *         P_img:
 *           type: string
 *         CG_id:
 *           type: integer
 * tags:
 *   - name: Products
 *     description: Product management API
 * 
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       '200':
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       '500':
 *         description: Database connection error
 * 
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - P_name
 *               - P_description
 *               - P_quantity
 *               - P_price
 *               - CG_id
 *             properties:
 *               P_name:
 *                 type: string
 *               P_description:
 *                 type: string
 *               P_quantity:
 *                 type: integer
 *               P_price:
 *                 type: number
 *                 format: float
 *               CG_id:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Product created successfully
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Error creating product
 * 
 * /products/category/{CG_id}:
 *   get:
 *     summary: Get products by category ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: CG_id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A list of products in the specified category
 *       '500':
 *         description: Error fetching products by category
 * 
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 * 
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               P_name:
 *                 type: string
 *               P_description:
 *                 type: string
 *               P_quantity:
 *                 type: integer
 *               P_price:
 *                 type: number
 *                 format: float
 *               CG_id:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Product updated successfully
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Error updating product
 * 
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 */

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

