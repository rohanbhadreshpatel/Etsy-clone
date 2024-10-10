import axios from "axios";
import React, { useEffect, useState } from "react";
import "./favourite.css";
import "../Home/home.css";
import EditIcon from "@mui/icons-material/Edit";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import EuroIcon from "@mui/icons-material/Euro";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import {
  Box,
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { Button } from "react-bootstrap";
import cookie from "react-cookies";
import { API } from "../../backend";

const Favourite = () => {
  const [currencyvalue, setcurrencyValue] = useState("USD");
  let currencySymbol = null;
  if (currencyvalue === "USD") {
    currencySymbol = <MonetizationOnIcon />;
  } else if (currencyvalue === "Euro") {
    currencySymbol = <EuroIcon />;
  } else if (currencyvalue === "INR") {
    currencySymbol = <CurrencyRupeeIcon />;
  }

  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [favouritesList, setFavouritesList] = useState([]);
  const [shopData, setShopData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(
    "https://www.etsy.com/images/avatars/default_avatar_400x400.png"
  );
  useEffect(() => {
    let isSubscribed = true;
    const ProfileId = cookie.load("cookie");
    // console.log(ProfileId);
    const fetchUserData = async () => {
      let responseData = await axios.get(API + "/profile", {
        params: {
          ProfileId: ProfileId,
        },
      });
      // console.log("TESSTTTT: " + JSON.stringify(responseData.data));
      setUserData(responseData.data[0]);
    };
    const fetchFavourites = async () => {
      let responseData = await axios.get(API + "/favouritesImages", {
        params: {
          Id: ProfileId,
        },
      });
      setFavouritesList(responseData.data);
    };

    axios
      .get(API + "/download-photo/", {
        params: {
          file: userData.ProfileImage,
        },
      })
      .then((response) => {
        // console.log("TESSSSTTTTT: fevbsfb: " + response.data);
        let imagePreview = response.data;
        setProfilePhoto(imagePreview);
        // console.log("preview: " + formValue.ProfileImagePreview);
      });

    if (isSubscribed) {
      fetchUserData().catch(console.error);
      fetchFavourites().catch(console.error);
    }
    return () => {
      isSubscribed = false;
    };
  }, [userData.ProfileImage]);
  const handleEditIcon = () => {
    // console.log(JSON.stringify(userData.Name));
    navigate("/profile");
  };

  const displayProduct = (e) => {
    navigate("/product", {
      state: e.target.name,
    });
  };

  let FavouriteItemList = (
    <>
      <Box display="flex" alignItems="center" justifyContent="center">
        <img
          src="https://www.etsy.com/assets/svg/profile/empty_favorite_items_new_brand.svg"
          alt=""
          width="150"
          height="150"
        />
        <br />
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <p>Nothing here... yet</p>
      </Box>
    </>
  );
  if (favouritesList.length !== 0) {
    FavouriteItemList = (
      <>
        <ImageList cols={4}>
          {favouritesList.map((item) => (
            <ImageListItem sx={{ padding: "10px" }} key={item.ItemId}>
              <img
                id="item-image"
                src={item.ItemImage}
                // src={`${item.ItemImage}?w=248&fit=crop&auto=format`}
                // srcSet={`${item.ItemImage}?w=248&fit=crop&auto=format&dpr=2 2x`}
                name={item.ItemId}
                alt={item.title}
                onClick={displayProduct}
                loading="lazy"
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
              />
            </ImageListItem>
          ))}
        </ImageList>
      </>
    );
  }

  return (
    <>
      <NavBar>New navigation</NavBar>

      <br />
      <div className="content-container">
        <div>
          <div class="container">
            <div class="d-flex justify-content-between">
              <div class="d-flex justify-content-start">
                <div>
                  <img
                    id="profile-image"
                    src={profilePhoto}
                    alt="Avatar"
                    style={{ width: "150px" }}
                  />
                </div>
                <h4 class="display-6">&nbsp;&nbsp;{userData.Name}</h4>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <EditIcon fontSize="large" onClick={handleEditIcon} />
              </div>
              <div className="d-flex justify-content-end">
                <div class="d-flex flex-column">
                  <div></div>
                  <br />
                  <Button
                    variant="dark"
                    onClick={() => navigate("/name-your-shop")}
                  >
                    Your Shop
                  </Button>
                </div>
              </div>
            </div>

            <br />
            <br />
            <br />
            <h4>Favourite Items</h4>
            {FavouriteItemList}
          </div>
        </div>
      </div>
      <div className="footer--pin">
        <Footer setcurrencyValue={setcurrencyValue} />
      </div>

      {/* <div class="container-profile-page">
        <div class="fixed">
          <img
            id="profile-image"
            src={userData.ProfileImage}
            alt="Avatar"
            style={{ width: "200px" }}
          />
        </div>
        <div class="flex-item">
          <h3>{userData.Name}</h3> 
          
        </div>
        <EditIcon />
      </div>
      <div class="container-profile-page">Favorite items</div> */}
    </>
  );
};
export default Favourite;