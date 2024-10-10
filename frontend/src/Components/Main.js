import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import Profile from "./Profile/Profile";
import NavBar from "./NavBar/NavBar";
import Cart from "./Cart/Cart";
import Favourite from "./Favourite/Favourite";
import Product from "./Home/Product";
import History from "./OrderHistory/History";
import ShopName from "./Shop/ShopName";
import ShopPage from "./Shop/ShopPage";
import SearchPage from "./Search/SearchPage";

class Main extends Component {
  render() {
    axios.defaults.withCredentials = true;
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<NavBar />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favourite" element={<Favourite />} />
            <Route path="/product" element={<Product />} />
            <Route path="/orderhistory" element={<History />} />
            <Route path="/name-your-shop" element={<ShopName />} />
            <Route path="/your-shop" element={<ShopPage />} />
            <Route path="/search-page" element={<SearchPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}
export default Main;
