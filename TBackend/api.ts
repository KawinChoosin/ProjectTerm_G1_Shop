import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post('/addProduct', async (req, res) => {
  const { productName, description, price, category, quantity, image } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        P_name: productName,
        P_description: description,
        P_price: parseFloat(price),
        P_quantity: parseInt(quantity),
        P_img: image,
        CG_id: parseInt(category),
      },
    });
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error adding product' });
  }
});

app.get('/adminPage', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

app.listen(5174, () => console.log('Server running on http://localhost:5174'));

