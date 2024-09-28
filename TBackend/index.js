// app.js
const express = require("express");
const bodyParser = require("body-parser");
const addressRoutes = require("./routes/addressRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const loginRoutes = require("./routes/loginRoutes");
const registerRoutes = require("./routes/registerRoutes");

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Use the modular routes
app.use("/address", addressRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
