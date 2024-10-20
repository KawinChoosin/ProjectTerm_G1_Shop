const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function P_test() {
  const existingCustomer = await prisma.customer.findUnique({
    where: { C_email: "testuser@example.com" },
  });

  if (!existingCustomer) {
    // Insert the customer if it doesn't exist
    await prisma.customer.create({
      data: {
        C_name: "admin",
        C_password: "admin", // Consider hashing the password before storing
        C_email: "admin@admin.com",
        C_gender: "other",
        C_age: 99,
        T_pnum: "0999999999",
        C_Role: true, // Role is defaulted to false but explicitly included here
      },
    });
  }

  // Check if categories already exist
  const existingCategories = await prisma.category.findMany();

  if (existingCategories.length === 0) {
    // Insert categories if they don't exist
    await prisma.category.createMany({
      data: [
        { CG_name: "Sports" },
        { CG_name: "Clothes" },
        { CG_name: "Electronics" },
      ],
    });
  }

  // Insert products for each category if they don't exist
  const categories = await prisma.category.findMany();

  for (const category of categories) {
    const existingProducts = await prisma.product.findMany({
      where: { CG_id: category.CG_id },
    });

    if (existingProducts.length === 0) {
      // Insert products based on category
      if (category.CG_name === "Sports") {
        await prisma.product.createMany({
          data: [
            {
              P_name: "Bike",
              P_description: "Green bike for outdoor sports",
              P_quantity: 5,
              P_price: 100.0,
              CG_id: category.CG_id,
              P_img: "1.png",
            },
            {
              P_name: "Football",
              P_description: "Standard football for matches",
              P_quantity: 10,
              P_price: 25.0,
              CG_id: category.CG_id,
              P_img: "2.png",
            },
            {
              P_name: "Tennis Racket",
              P_description: "Lightweight tennis racket",
              P_quantity: 15,
              P_price: 75.0,
              CG_id: category.CG_id,
              P_img: "3.png",
            },
          ],
        });
      } else if (category.CG_name === "Clothes") {
        await prisma.product.createMany({
          data: [
            {
              P_name: "T-Shirt",
              P_description: "Comfortable cotton t-shirt",
              P_quantity: 20,
              P_price: 15.0,
              CG_id: category.CG_id,
              P_img: "4.png",
            },
            {
              P_name: "Jeans",
              P_description: "Blue denim jeans",
              P_quantity: 30,
              P_price: 40.0,
              CG_id: category.CG_id,
              P_img: "5.png",
            },
            {
              P_name: "Jacket",
              P_description: "Warm winter jacket",
              P_quantity: 12,
              P_price: 120.0,
              CG_id: category.CG_id,
              P_img: "6.png",
            },
          ],
        });
      } else if (category.CG_name === "Electronics") {
        await prisma.product.createMany({
          data: [
            {
              P_name: "Laptop",
              P_description: "High-performance laptop",
              P_quantity: 8,
              P_price: 800.0,
              CG_id: category.CG_id,
              P_img: "7.png",
            },
            {
              P_name: "Smartphone",
              P_description: "Latest model smartphone",
              P_quantity: 25,
              P_price: 600.0,
              CG_id: category.CG_id,
              P_img: "8.png",
            },
            {
              P_name: "Headphones",
              P_description: "Noise-cancelling headphones",
              P_quantity: 50,
              P_price: 150.0,
              CG_id: category.CG_id,
              P_img: "9.png",
            },
          ],
        });
      }
    }
  }
}

// Call the function
P_test()
  .then(() => {
    console.log("Data inserted successfully!");
  })
  .catch((e) => {
    console.error("Error inserting data: ", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
