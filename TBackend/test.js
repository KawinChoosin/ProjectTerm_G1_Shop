
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function P_test() {
  // Insert categories first
  await prisma.category.createMany({
    data: [
      { CG_id: 1, CG_name: "Sport" },
      { CG_id: 2, CG_name: "Cloth" },
      { CG_id: 3, CG_name: "Electronic" }
    ]
  });

  // Insert products for each category

  // Sport category products (CG_id: 1)
  await prisma.product.createMany({
    data: [
      {
        P_name: "Bike",
        P_description: "Green bike for outdoor sports",
        P_quantity: 5,
        P_price: 100.00,
        CG_id: 1,
        P_img: "https://i5.walmartimages.com/seo/Hyper-Bicycle-26-Men-s-Havoc-Mountain-Bike-Black_598552b8-96fc-4e95-9fbd-10b48c25f76a.ab643dd657a02399f80cfcc2adcc9b22.jpeg"
      },
      {
        P_name: "Football",
        P_description: "Standard football for matches",
        P_quantity: 10,
        P_price: 25.00,
        CG_id: 1,
        P_img: "https://media.istockphoto.com/id/610241662/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%A5%E0%B8%B9%E0%B8%81%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%99%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B5%E0%B8%82%E0%B8%B2%E0%B8%A7.jpg?s=612x612&w=0&k=20&c=qc1fpQoQjlyeXj73w3gWtRMpL0i6AX9T_4pNmx7rduc="
      },
      {
        P_name: "Tennis Racket",
        P_description: "Lightweight tennis racket",
        P_quantity: 15,
        P_price: 75.00,
        CG_id: 1,
        P_img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHOCBcsDToYJSe4n7bn7deIO16auJqluxpSg&s"
      }
    ]
  });

  // Cloth category products (CG_id: 2)
  await prisma.product.createMany({
    data: [
      {
        P_name: "T-Shirt",
        P_description: "Comfortable cotton t-shirt",
        P_quantity: 20,
        P_price: 15.00,
        CG_id: 2,
        P_img: "https://isto.pt/cdn/shop/files/Heavyweight_Black_ef459afb-ff7a-4f9a-b278-9e9621335444.webp?v=1710414950"
      },
      {
        P_name: "Jeans",
        P_description: "Blue denim jeans",
        P_quantity: 30,
        P_price: 40.00,
        CG_id: 2,
        P_img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPvHcOxrwkYyvOw-C1NWvRgZ8nd-ib-Y3H_Q&s"
      },
      {
        P_name: "Jacket",
        P_description: "Warm winter jacket",
        P_quantity: 12,
        P_price: 120.00,
        CG_id: 2,
        P_img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIPgD0roIatOa0eiPkMPemhSbYU20lojcJqQ&s"
      }
    ]
  });

  // Electronic category products (CG_id: 3)
  await prisma.product.createMany({
    data: [
      {
        P_name: "Laptop",
        P_description: "High-performance laptop",
        P_quantity: 8,
        P_price: 800.00,
        CG_id: 3,
        P_img: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW16TLT?ver=99ac&q=90&m=6&h=705&w=1253&b=%23FFFFFFFF&f=jpg&o=f&p=140&aim=true"
      },
      {
        P_name: "Smartphone",
        P_description: "Latest model smartphone",
        P_quantity: 25,
        P_price: 600.00,
        CG_id: 3,
        P_img: "https://m.media-amazon.com/images/I/61nzbNdA7hL.jpg"
      },
      {
        P_name: "Headphones",
        P_description: "Noise-cancelling headphones",
        P_quantity: 50,
        P_price: 150.00,
        CG_id: 3,
        P_img: "https://sony.scene7.com/is/image/sonyglobalsolutions/wh-ch520_Primary_image?$categorypdpnav$&fmt=png-alpha"
      }
    ]
  });
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
