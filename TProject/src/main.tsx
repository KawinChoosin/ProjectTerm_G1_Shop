import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import "./reset.css";
import App from "./App.tsx";
import CartPage from "./components/cart/CartPage.tsx";
import SummaryPage from "./components/SummaryPage.tsx";
import ProductDetail from "./components/Productdetail.tsx";
import App_Login from "./page/Login/App_Login.tsx";
import App_Register from "./page/Register/App_Register.tsx";
import FavPage from "./components/favourite/FavPage.tsx";
import { UserProvider } from "./context/UserContext.tsx"; // Import UserProvider
import Tapmenu from "./page/User/TabsMenu.tsx"
import { ThemeContextProvider } from './ThemeContext.tsx';

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <UserProvider>
    {/* <ThemeContextProvider> */}
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/login" element={<App_Login />} />
          <Route path="/register" element={<App_Register />} />
          <Route path="/favourite" element={<FavPage />} />
          
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/profile" element={<Tapmenu />} />
          {/* </Route> */}
        </Routes>
      </Router>
      {/* </ThemeContextProvider> */}
    </UserProvider>
  </StrictMode>
);
