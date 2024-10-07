const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function P_test() {
  // Check if customer already exists
  // const existingCustomer = await prisma.customer.findUnique({
  //   where: { C_email: "testuser@example.com" },
  // });

  // if (!existingCustomer) {
  //   // Insert the customer if it doesn't exist
  //   await prisma.customer.create({
  //     data: {
  //       C_name: "test",
  //       C_password: "1234",
  //       C_email: "testuser@example.com",
  //       C_gender: "Male",
  //       C_age: 25,
  //       T_pnum: "0976543210"
  //     },
  //   });
  // }

  // Check if categories already exist
  const existingCategories = await prisma.category.findMany();

  if (existingCategories.length === 0) {
    // Insert categories if they don't exist
    await prisma.category.createMany({
      data: [
        { CG_name: "Sport" },
        { CG_name: "Cloth" },
        { CG_name: "Electronic" },
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
      if (category.CG_name === "Sport") {
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
      } else if (category.CG_name === "Cloth") {
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
      } else if (category.CG_name === "Electronic") {
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

  // Check if addresses already exist for the customer
  // const existingAddresses = await prisma.address.findMany({
  //   where: { C_id: existingCustomer ? existingCustomer.C_id : 1 }, // Use the existing customer ID
  // });
  // const existingAddresses = await prisma.address.findMany({
  //   where: { C_id: existingCustomer ? existingCustomer.C_id : 1 }, // Use the existing customer ID
  // });

  // if (existingAddresses.length === 0) {
  //   // Insert addresses if they don't exist
  //   await prisma.address.createMany({
  //     data: [
  //       {
  //         A_street: "123 Main St",
  //         A_city: "Hometown",
  //         A_state: "CA",
  //         A_postalCode: "12345",
  //         A_country: "USA",
  //         C_id: 1,
  //       },
  //       {
  //         A_street: "456 Elm St",
  //         A_city: "Big City",
  //         A_state: "NY",
  //         A_postalCode: "67890",
  //         A_country: "USA",
  //         C_id: 1,
  //       },
  //     ],
  //   });
  // }

  // const order = await prisma.order.create({
  //   data: {
  //     C_id: existingCustomer ? existingCustomer.C_id : 1, // Use existing customer ID
  //     Q_Date_time: new Date(),
  //     O_Total: 0, // This will be calculated based on order details
  //     PM_id: 1, // Assuming a payment method ID, adjust as necessary
  //     A_id: existingAddresses[0].A_id, // Use the first address
  //     Payslip: "123456789.jpg", // Replace with actual payslip filename
  //     OrderDetail: {
  //       create: [
  //         {
  //           P_id: 1, // Adjust the product ID as needed
  //           OD_quantity: 2,
  //           OD_price: 100.0, // Adjust the price as needed
  //         },
  //         {
  //           P_id: 2, // Adjust the product ID as needed
  //           OD_quantity: 5,
  //           OD_price: 5000.0, // Adjust the price as needed
  //         },
  //         {
  //           P_id: 8, // Adjust the product ID as needed
  //           OD_quantity: 5,
  //           OD_price: 10000.0, // Adjust the price as needed
  //         },
  //       ],
  //     },
  //   },
  //   include: {
  //     OrderDetail: true,
  //   },
  // });

  // Calculate total
  // const total = order.OrderDetail.reduce((sum, item) => sum + item.OD_price * item.OD_quantity, 0);
  // await prisma.order.update({
  //   where: { O_id: order.O_id },
  //   data: { O_Total: total },
  // });

  // // console.log("Order created successfully:");
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
