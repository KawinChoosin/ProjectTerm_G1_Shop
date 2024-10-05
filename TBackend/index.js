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

const path = require("path");
const app = express();
const cors = require("cors");

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
