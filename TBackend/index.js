const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Database connection error" });
  }
});

// Add a product
app.post("/products", async (req, res) => {
  const { P_name, P_description, P_quantity, P_price, P_img, CG_id } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: {
        P_name,
        P_description,
        P_quantity,
        P_price, // Ensure that this is an integer
        P_img,
        CG_id, // Ensure the category ID is provided
      },
    });
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
});

// Get products by category ID
app.get("/products/category/:CG_id", async (req, res) => {
  const { CG_id } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: {
        CG_id: parseInt(CG_id, 10), // Ensure CG_id is treated as an integer
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products by category" });
  }
});

// Get a product by ID
app.get("/products/:id", async (req, res) => {
  const productId = parseInt(req.params.id, 10); // Ensure P_id is treated as an integer
  try {
    const product = await prisma.product.findUnique({
      where: {
        P_id: productId, // P_id is now an integer
      },
      include: {
        Category: true, // Include related category data
        Rate: true, // Include related rates
        Comment: true, // Include related comments
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update product quantity in cart
app.patch("/cart/update", async (req, res) => {
  const { C_id, P_id, CA_quantity, CA_price } = req.body;

  try {
    const updatedCartDetail = await prisma.cartDetail.update({
      where: {
        C_id_P_id: { C_id, P_id },
      },
      data: {
        CA_quantity,
        CA_price: CA_price * CA_quantity, // Update total price accordingly
      },
    });
    res.json(updatedCartDetail);
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ error: "Error updating cart quantity" });
  }
});

// Add product to cart
app.post("/cart/add", async (req, res) => {
  const { C_id, P_id, CA_quantity, CA_price } = req.body;

  try {
    const existingCartDetail = await prisma.cartDetail.findUnique({
      where: {
        C_id_P_id: { C_id, P_id }, // Composite primary key
      },
    });

    // already have item
    if (existingCartDetail) {
      const updatedCartDetail = await prisma.cartDetail.update({
        where: {
          C_id_P_id: { C_id, P_id },
        },
        data: {
          CA_quantity: existingCartDetail.CA_quantity + CA_quantity,
          CA_price: existingCartDetail.CA_price + CA_price * CA_quantity,
        },
      });
      res.json(updatedCartDetail);
    } else {
      const newCartDetail = await prisma.cartDetail.create({
        data: {
          C_id,
          P_id,
          CA_quantity,
          CA_price: CA_price * CA_quantity, // Calculate total price
        },
      });
      res.json(newCartDetail);
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Error adding product to cart" });
  }
});

// Delete product from cart
app.delete("/cart/delete", async (req, res) => {
  const { C_id, P_id } = req.body;

  try {
    // Delete the cart item where the customer ID and product ID match
    const deletedCartDetail = await prisma.cartDetail.delete({
      where: {
        C_id_P_id: {
          C_id: parseInt(C_id, 10), // Ensure C_id is treated as an integer
          P_id: parseInt(P_id, 10), // Ensure P_id is treated as an integer
        },
      },
    });
    res.json({
      message: "Item successfully deleted from cart",
      deletedCartDetail,
    });
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    res.status(500).json({ error: "Error deleting product from cart" });
  }
});

// Get all cart items for a specific customer
app.get("/cart/:C_id", async (req, res) => {
  const { C_id } = req.params;

  try {
    const cartItems = await prisma.cartDetail.findMany({
      where: {
        C_id: parseInt(C_id, 10), // Ensure C_id is treated as an integer
      },
      include: {
        Product: true,
      },
    });
    if (cartItems.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found in the cart for this customer" });
    }

    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Error fetching cart items" });
  }
});

// Get all favourite items for a specific customer
app.get("/favourite/:C_id", async (req, res) => {
  const { C_id } = req.params;

  try {
    const favItems = await prisma.favourite.findMany({
      where: {
        C_id: parseInt(C_id, 10), // แปลง C_id ให้เป็นตัวเลข
      },
      include: {
        Product: true, // ดึงข้อมูลสินค้าที่เกี่ยวข้อง
      },
    });

    if (favItems.length === 0) {
      return res.status(404).json({
        message: "No items found in the favourites for this customer",
      });
    }

    res.json(favItems);
  } catch (error) {
    console.error("Error fetching favourite items:", error);
    res.status(500).json({ error: "Error fetching favourite items" });
  }
});

// Add product to favourites
app.post("/favourite/add", async (req, res) => {
  const { C_id, P_id } = req.body;

  try {
    const existingFavItem = await prisma.favourite.findUnique({
      where: {
        C_id_P_id: { C_id, P_id }, // Composite primary key for favorites
      },
    });

    if (existingFavItem) {
      return res.status(400).json({ error: "Item already in favourites" });
    } else {
      const newFavItem = await prisma.favourite.create({
        data: {
          C_id,
          P_id,
        },
      });
      res.json(newFavItem);
    }
  } catch (error) {
    console.error("Error adding product to favourites:", error);
    res.status(500).json({ error: "Error adding product to favourites" });
  }
});

// Remove product from favourites
app.delete("/favourite/remove", async (req, res) => {
  const { C_id, P_id } = req.body;

  if (!C_id || !P_id) {
    return res.status(400).json({ error: "C_id and P_id are required" });
  }

  try {
    const removeItem = await prisma.favourite.delete({
      where: {
        C_id_P_id: { C_id, P_id },
      },
    });

    res.json({
      message: "Item successfully removed from favourites",
      removeItem,
    });
  } catch (error) {
    console.error("Error removing product from favourites:", error);
    res.status(500).json({ error: "Error removing product from favourites" });
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
