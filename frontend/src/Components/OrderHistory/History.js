import axios from "axios";
import React, { useEffect } from "react";
import cookie from "react-cookies";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EuroIcon from "@mui/icons-material/Euro";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import HeartIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import { API } from "../../backend";

const History = () => {
  const [currencyvalue, setcurrencyValue] = useState("USD");
  let currencySymbol = null;
  if (currencyvalue === "USD") {
    currencySymbol = <MonetizationOnIcon />;
  } else if (currencyvalue === "Euro") {
    currencySymbol = <EuroIcon />;
  } else if (currencyvalue === "INR") {
    currencySymbol = <CurrencyRupeeIcon />;
  }
  const [purchaseData, setData] = useState({});
  const ProfileId = cookie.load("cookie");
  //   console.log(ProfileId);
  useEffect(() => {
    axios.post(API + "/history", { ProfileId: ProfileId }).then((response) => {
      console.log(response.data);
      setData(response.data);
    });
  }, []);
  //   console.log(purchaseData);
  //   const temp = [];
  //   var fooArray = Object.entries(purchaseData);
  //   fooArray.flat();
  //   console.log("TEST" + fooArray);
  //   fooArray.forEach(([key, value]) => {
  //     console.log(key); // 'one'
  //     console.log(value); // 1
  //     temp.push({ key: value });
  //   });
  //   console.log(temp);
  let temp = [];
  for (var i = 0; i < purchaseData.length; i++) {
    temp.push(purchaseData[i]);
  }
  console.log(temp);
  let purchases = temp.map((order) => {
    // console.log(order.ItemName);
    return (
      <tr>
        <td class="text-center">{order.OrderId}</td>
        <td style={{ width: "500px", height: "200px" }} class="text-center">
          <img
            style={{ width: "300px", height: "300px" }}
            src={order.ItemImage}
          ></img>
        </td>
        <td class="text-center">{order.ItemId}</td>
        <td class="text-center">{order.ShopName}</td>
        <td class="text-center">{order.Quantity}</td>
        <td class="text-center">{order.PurchaseDate}</td>
        <td class="text-center">{order.Price * order.Quantity}</td>
      </tr>
    );
  });

  return (
    <div>
      <div className="content-container" style={{ height: "1500px" }}>
        <NavBar />
        <div id="content" class="col-sm-12">
          <hr />
          <center>
            <h1> Order History</h1>
          </center>
          <hr />
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <td class="text-center">Order ID</td>
                  <td class="text-right">Item</td>
                  <td class="text-center">Name</td>
                  <td class="text-center">Shop</td>
                  <td class="text-center">Quantity</td>
                  <td class="text-center">Date Added</td>
                  <td class="text-center">Total</td>
                </tr>
              </thead>
              <tbody>{purchases}</tbody>
              <tr>
                <td>TOTAL</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div className="footer--pin">
        <Footer setcurrencyValue={setcurrencyValue} />
      </div>
    </div>
  );
};

export default History;
