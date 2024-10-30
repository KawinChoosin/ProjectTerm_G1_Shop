// app.js
const express = require("express");
const bodyParser = require("body-parser");
const addressRoutes = require("./routes/addressRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const favRoutes = require("./routes/favRoutes");
const loginRoutes = require("./routes/loginRoutes");
const registerRoutes = require("./routes/registerRoutes");
const profile = require("./routes/profileRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const orderList = require("./routes/orderListRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const authenRoutes = require("./routes/authenRoutes");

const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");

const path = require("path");
const app = express();
const cors = require("cors");
const { title } = require("process");
const { version } = require("os");
const { description } = require("./schemas/addressSchema");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/slip", express.static(path.join(__dirname, "./slip")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Use the modular routes
app.use("/address", addressRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/favourite", favRoutes);
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/profile", profile);
app.use("/upload", uploadRoutes);
app.use("/orderlist", orderList);
app.use("/categories", categoryRoutes);
app.use("/auth/google", authenRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running");
});

const options = {
  definition: {
    openapi: "3.0.0",
    info:{
      title : "KAD-ENT",
      version : "0.0.1",
      description : "This is the api document for KAD-ENT website in Full-Stack course in 2024"
    },
    servers: [
      {
        url: "http://localhost:3000/",
      }
    ]
  },
  apis: ["./routes/*.js"]
};

const spacs = swaggerjsdoc(options);
app.use(
  "/api-docs",
  swaggerui.serve,
  swaggerui.setup(spacs)
)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
