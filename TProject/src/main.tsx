import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import CartPage from "./components/cart/CartPage.tsx";
import SummaryPage from "./components/summaryPage.tsx";
// import './input.css'
// import Login from "./page/Login/App_Login.tsx"
import React from "react";
import "./reset.css";
import ProductDetail from "./components/Productdetail.tsx";
import App_Login from "./page/Login/App_Login.tsx"; // import login page
import App_Register from "./page/Register/App_Register.tsx"; // import login page

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/login" element={<App_Login />} />
        <Route path="/register" element={<App_Register />} />
        {/* <Route path="/electronic" element={<Elec />} />
        <Route path="/cloth" element={<Cloth />} />
        <Route path="/sport" element={<Sport />} /> */}
      </Routes>
    </Router>
  </React.StrictMode>
);
