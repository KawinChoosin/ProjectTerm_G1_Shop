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
              P_img:
                "https://i5.walmartimages.com/seo/Hyper-Bicycle-26-Men-s-Havoc-Mountain-Bike-Black_598552b8-96fc-4e95-9fbd-10b48c25f76a.ab643dd657a02399f80cfcc2adcc9b22.jpeg",
            },
            {
              P_name: "Football",
              P_description: "Standard football for matches",
              P_quantity: 10,
              P_price: 25.0,
              CG_id: category.CG_id,
              P_img:
                "https://media.istockphoto.com/id/610241662/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%A5%E0%B8%B9%E0%B8%81%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%99%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B5%E0%B8%82%E0%B8%B2%E0%B8%A7.jpg?s=612x612&w=0&k=20&c=qc1fpQoQjlyeXj73w3gWtRMpL0i6AX9T_4pNmx7rduc=",
            },
            {
              P_name: "Tennis Racket",
              P_description: "Lightweight tennis racket",
              P_quantity: 15,
              P_price: 75.0,
              CG_id: category.CG_id,
              P_img:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHOCBcsDToYJSe4n7bn7deIO16auJqluxpSg&s",
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
              P_img:
                "https://isto.pt/cdn/shop/files/Heavyweight_Black_ef459afb-ff7a-4f9a-b278-9e9621335444.webp?v=1710414950",
            },
            {
              P_name: "Jeans",
              P_description: "Blue denim jeans",
              P_quantity: 30,
              P_price: 40.0,
              CG_id: category.CG_id,
              P_img:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPvHcOxrwkYyvOw-C1NWvRgZ8nd-ib-Y3H_Q&s",
            },
            {
              P_name: "Jacket",
              P_description: "Warm winter jacket",
              P_quantity: 12,
              P_price: 120.0,
              CG_id: category.CG_id,
              P_img:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIPgD0roIatOa0eiPkMPemhSbYU20lojcJqQ&s",
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
              P_img:
                "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW16TLT?ver=99ac&q=90&m=6&h=705&w=1253&b=%23FFFFFFFF&f=jpg&o=f&p=140&aim=true",
            },
            {
              P_name: "Smartphone",
              P_description: "Latest model smartphone",
              P_quantity: 25,
              P_price: 600.0,
              CG_id: category.CG_id,
              P_img: "https://m.media-amazon.com/images/I/61nzbNdA7hL.jpg",
            },
            {
              P_name: "Headphones",
              P_description: "Noise-cancelling headphones",
              P_quantity: 50,
              P_price: 150.0,
              CG_id: category.CG_id,
              P_img:
                "https://sony.scene7.com/is/image/sonyglobalsolutions/wh-ch520_Primary_image?$categorypdpnav$&fmt=png-alpha",
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

  // Create a payment method if it doesn't exist
// const paymentMethod = await prisma.payment.create({
//   data: {
//     PM_amount: 3325, // Set an appropriate initial amount
//     PM_path: "1235453.png", // Provide a path if needed
//     Date_time: new Date(), // Current time
//   },
// });



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
  //           OD_price: 200.0, // Adjust the price as needed
  //         },
  //         {
  //           P_id: 2, // Adjust the product ID as needed
  //           OD_quantity: 5,
  //           OD_price: 125.0, // Adjust the price as needed
  //         },
  //         {
  //           P_id: 8, // Adjust the product ID as needed
  //           OD_quantity: 5,
  //           OD_price: 3000.0, // Adjust the price as needed
  //         },
  //       ],
  //     },
  //   },
  //   include: {
  //     OrderDetail: true,
  //   },
  // });

  // // Calculate total
  // const total = order.OrderDetail.reduce((sum, item) => sum + item.OD_price * item.OD_quantity, 0);
  // await prisma.order.update({
  //   where: { O_id: order.O_id },
  //   data: { O_Total: total },
  // });

  // console.log("Order created successfully:");
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