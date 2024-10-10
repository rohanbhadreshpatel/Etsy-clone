import {
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShopItemForm from "./ShopItemForm";
import ShopImage from "./ShopImage";
import EditIcon from "@mui/icons-material/Edit";
import ShopItemFormEdit from "./ShopItemFormEdit";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import cookie from "react-cookies";
import { API } from "../../backend";

function ShopPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [shopData, setShopData] = useState({});
  const [shopItems, setShopItems] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerData, setOwnerData] = useState({});
  const [ownerPhoto, setOwnerPhoto] = useState(
    "https://www.etsy.com/images/avatars/default_avatar_400x400.png"
  );
  const [showItemForm, setShowItemForm] = useState(false);
  const [showItemFormEdit, setShowItemFormEdit] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const ProfileId = cookie.load("cookie");

  const [currencyvalue, setcurrencyValue] = useState("USD");

  useEffect(() => {
    let isSubscribed = true;
    const fetchAllShopData = async () => {
      console.log("COnsole Log from ShopPage.js: " + JSON.stringify(state));
      let responseShop = await axios.get(API + "/shop/details", {
        params: {
          ProfileId: ProfileId,
        },
      });
      await setShopData(responseShop.data);

      let responseOwnerDetails = await axios.get(API + "/profile", {
        params: {
          ProfileId: ProfileId,
        },
      });
      setOwnerData(responseOwnerDetails.data[0]);
      let responseShopItems = await axios.get(API + "/shop/items", {
        params: {
          ShopId: responseShop.data.ShopId,
        },
      });
      setShopItems(responseShopItems.data);
      console.log(JSON.stringify(responseShopItems.data));

      console.log(typeof responseShopItems.data);
      let totalSold = responseShopItems.data.reduce((prev, curr) => {
        return (prev += curr.QuantitySold);
      }, 0);
      //   console.log(totalSold);
      setTotalSales(totalSold);

      let responseIsOwner = await axios.get(API + "/shop/check-owner", {
        params: {
          ShopId: responseShop.data.ShopId,
          ProfileId: ProfileId,
        },
      });
      console.log("IsOwner:  " + responseIsOwner.data);
      setIsOwner(responseIsOwner.data);

      await axios
        .get(API + "/download-photo/", {
          params: {
            file: ownerData.ProfileImage,
          },
        })
        .then((response) => {
          console.log("TESSSSTTTTT: fevbsfb: " + response.data);
          let imagePreview = response.data;
          setOwnerPhoto(imagePreview);
          // console.log("preview: " + formValue.ProfileImagePreview);
        });
    };

    if (isSubscribed) {
      fetchAllShopData().catch(console.error());
    }
    return () => {
      isSubscribed = false;
    };
  }, [state, ProfileId, ownerData.ProfileImage]);

  const handleImageChange = async (event) => {
    var profilePhoto = event.target.files[0];
    var data = new FormData();
    data.append("photos", profilePhoto);
    let response = await axios.post(API + "/shop/upload-photo", data);
    var dataToPost = {
      ShopImage: response.data,
      ShopId: shopData.ShopId,
    };
    let responseImage = await axios.post(API + "/shop/add-photo", dataToPost);
    if (responseImage.data != undefined) {
      shopData.ShopImage = responseImage.data;
    }
    // console.log(shopData.ShopImage);
    setShopData(shopData);
    window.location.reload(false);
  };

  let handleEditIcon = (item) => {
    return function () {
      setSelectedItem(item);
      setShowItemFormEdit(true);
    };
  };
  const imageClickHandler = (event) => {
    navigate("/product", {
      state: event.target.name,
    });
  };

  let ShopItemImages = (
    <>
      <ImageList cols={4}>
        {shopItems.map((item) => (
          <ImageListItem sx={{ padding: "10px" }} key={item.ItemId}>
            <img
              src={item.ItemImage}
              name={item.ItemId}
              alt={item.ItemName}
              loading="lazy"
              onClick={imageClickHandler}
            />

            <ImageListItemBar
              title={item.ItemName}
              subtitle={"Sales: " + item.QuantitySold}
              actionIcon={
                isOwner && (
                  <EditIcon fontSize="medium" onClick={handleEditIcon(item)} />
                )
              }
              position="below"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );

  let contactDetails = null;
  if (showContactDetails) {
    contactDetails = <p>Email : {ownerData.Email}</p>;
  }

  return (
    <>
      <div class="content-container">
        <NavBar>New navigation</NavBar>
        <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <div className="d-flex justify-content-between">
              <div class="d-flex justify-content-start">
                {/* {shopImage} */}
                <br />
                <ShopImage data={shopData.ShopImage} />
                <div className="d-flex flex-column ">
                  <h1 class="display-4">&nbsp;{shopData.ShopName}</h1>
                  <div class="d-flex justify-content-start">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {isOwner && (
                      <label htmlFor="upload-photo">
                        <input
                          style={{ display: "none" }}
                          id="upload-photo"
                          name="upload-photo"
                          type="file"
                          onChange={handleImageChange}
                        />
                        <Button
                          variant="contained"
                          component="span"
                          style={{ color: "white", backgroundColor: "black" }}
                        >
                          Edit Shop Image
                        </Button>{" "}
                      </label>
                    )}
                    {isOwner && (
                      <div>
                        <h4>Total Sales : {totalSales}</h4>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <div className="d-flex flex-column ">
                  <div className="d-flex justify-content-center">
                    SHOP OWNER
                  </div>
                  <div className="d-flex justify-content-center">
                    <img
                      id="avatar_img"
                      style={{ width: 100, height: 100 }}
                      src={ownerPhoto}
                      alt=""
                      className="img-fluid rounded-circle"
                    />
                  </div>

                  {/* <br/> */}
                  <div className="d-flex justify-content-center">
                    {ownerData.Name}
                  </div>
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="text"
                      style={{ size: "small", color: "black" }}
                      onClick={() => setShowContactDetails(true)}
                    >
                      Contact
                    </Button>
                  </div>
                  <div className="d-flex justify-content-center">
                    {contactDetails}
                  </div>
                </div>
              </div>
            </div>
            <br />
            <br />
          </div>
          <div class="container">
            <div className="d-flex flex-column ">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>Shop Items</h4>
                </div>
                <div>
                  {isOwner && (
                    <Button
                      style={{ color: "white", backgroundColor: "black" }}
                      // onClick={() => setShowItemForm(true)}
                      onClick={() => setShowItemForm(true)}
                    >
                      Add Item
                    </Button>
                  )}
                  {/* {addEditItem} */}
                  <ShopItemForm
                    data={shopData}
                    show={showItemForm}
                    onHide={() => setShowItemForm(false)}
                  />
                  <ShopItemFormEdit
                    data={shopData}
                    show={showItemFormEdit}
                    onHide={() => setShowItemFormEdit(false)}
                    item={selectedItem}
                    key={selectedItem.ItemId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <br />
          <br />
          {ShopItemImages}
        </div>
      </div>
      <div className="footer--pin">
        <Footer setcurrencyValue={setcurrencyValue} />
      </div>
    </>
  );
}

export default ShopPage;
