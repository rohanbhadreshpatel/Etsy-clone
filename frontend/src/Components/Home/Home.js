import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import axios from "axios";
import cookie from "react-cookies";
import "./home.css";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import EuroIcon from "@mui/icons-material/Euro";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { useNavigate } from "react-router-dom";
import Favourite from "../Pages/Favourite";
import { API } from "../../backend";

function Home() {
  const [currencyvalue, setcurrencyValue] = useState("USD");
  let currencySymbol = null;
  if (currencyvalue === "USD") {
    currencySymbol = <MonetizationOnIcon />;
  } else if (currencyvalue === "Euro") {
    currencySymbol = <EuroIcon />;
  } else if (currencyvalue === "INR") {
    currencySymbol = <CurrencyRupeeIcon />;
  }
  axios.defaults.withCredentials = true;
  let userPanel = null;
  const [userName, setUsername] = useState("");
  if (cookie.load("ProfileDetails")) {
    userPanel = (
      //   <div>
      //     <center>
      //       <h1>Welcome back, {username}!</h1>
      //     </center>
      //   </div>

      <Card.Body>
        <Card.Text style={{ fontSize: "50px", fontFamily: "Times New Roman" }}>
          Welcome back,{" "}
          <a style={{ color: "black" }} href="/profile">
            {userName}
          </a>
          !
        </Card.Text>
      </Card.Body>
    );
  } else {
    userPanel = (
      //   <div>
      //     <center>
      //       <h1>Explore one-of-a-kind finds from independent makers</h1>
      //     </center>
      //   </div>

      <Card.Body>
        <Card.Text
          style={{
            fontSize: "50px",
            fontFamily: "Times New Roman",
            lineHeight: "90px",
          }}
        >
          Explore one-of-a-kind finds from independent makers
        </Card.Text>
      </Card.Body>
    );
  }
  // setUserPanel = () => {
  //     if(cookie.load('cookie')){
  //         userPanel =
  //         <div>
  //             <center><h1>Welcome back, {username}!</h1></center>
  //         </div>
  //     }
  // }
  const [itemData, setItemData] = useState([]);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();

  const fetchItemImages = () => {
    axios.get(API + "/getProducts").then((response) => {
      setItemData(response.data);
      // itemData = JSON.parse(itemData);
    });
  };
  const fetchUserDetails = async () => {
    await axios.get(API + "/home").then((response) => {
      var stringify = JSON.stringify(response.data.user_details[0].Name);
      // console.log(
      // "JADBFNJI: " + JSON.stringify(response.data.user_details[0].Name)
      // );
      setUsername(stringify.slice(1, -1));
      // setUserPanel;
    });
  };
  useEffect(() => {
    fetchItemImages();
    fetchUserDetails();
  }, [userName]);

  const displayProduct = (e) => {
    navigate("/product", {
      state: e.target.name,
    });
  };

  return (
    <div>
      <div className="content-container" style={{ height: "2000px" }}>
        <NavBar />
        <Card
          style={{
            textAlign: "center",
            background: "#fdebd2",
            height: "120px",
          }}
        >
          {userPanel}
        </Card>
        {/* {currencySymbol}
        {currencyvalue} */}

        <ImageList
          cols={4}
          sx={{ padding: "10px", width: "100%", height: 1500 }}
        >
          {itemData.map((item) => (
            <ImageListItem sx={{ padding: "10px" }} key={item.ItemId}>
              <img
                src={item.ItemImage}
                name={item.ItemId}
                alt={item.ItemName}
                onClick={displayProduct}
              />
              <ImageListItemBar
                sx={{ backgroundColor: "transparent" }}
                title={
                  <Button
                    style={{
                      backgroundColor: "black",
                      borderColor: "black",
                      borderRadius: "40px",
                    }}
                  >
                    {currencySymbol} {item.Price}
                  </Button>
                }
                actionIcon={<Favourite data={item}></Favourite>}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
      <div className="footer--pin">
        <Footer setcurrencyValue={setcurrencyValue} />
      </div>
    </div>
  );
}

export default Home;
