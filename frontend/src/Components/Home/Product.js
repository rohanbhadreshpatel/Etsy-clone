import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import {
  FavoriteBorderOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@material-ui/icons";
import styled from "styled-components";
import { mobile } from "../../responsive";
import EuroIcon from "@mui/icons-material/Euro";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useDispatch } from "react-redux";
import { addProduct } from "../../Redux/cartRedux";
import { useNavigate } from "react-router-dom";
import { API } from "../../backend";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Favourite from "../Pages/Favourite";

const Product = () => {
  const navigate = useNavigate();
  const [currencyvalue, setcurrencyValue] = useState("USD");
  let currencySymbol = null;
  if (currencyvalue === "USD") {
    currencySymbol = <MonetizationOnIcon style={{ fontSize: "50px" }} />;
  } else if (currencyvalue === "Euro") {
    currencySymbol = <EuroIcon style={{ fontSize: "50px" }} />;
  } else if (currencyvalue === "INR") {
    currencySymbol = <CurrencyRupeeIcon style={{ fontSize: "50px" }} />;
  }
  //   const itemdetails1 = {
  //     ImageId: 10,
  //     ImageName: "ITEM",
  //   };
  const [itemDetails, setItemDetails] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { state } = useLocation();
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addProduct({
        itemDetails,
        quantity,
        price: parseFloat(itemDetails.Price) * parseInt(quantity),
      })
    );
    axios.post("");
    navigate("/cart");
  };
  const handleCount = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  useEffect(() => {
    const fetchProductData = async () => {
      await axios
        .get(API + "/productDetails", {
          params: { ItemId: state },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data[0]);
            setItemDetails(response.data[0]);
          }
        });
    };
    fetchProductData().catch(console.error);
    // console.log(itemDetails);
  }, [state]);

  let qtyarray = [];
  for (var i = 1; i <= itemDetails.QuantityAvailable; i++) {
    qtyarray.push(i);
  }
  const Container = styled.div``;

  const Wrapper = styled.div`
    padding: 50px;
    display: flex;
    ${mobile({ padding: "10px", flexDirection: "column" })}
  `;

  const ImgContainer = styled.div`
    flex: 1;
  `;

  const InfoContainer = styled.div`
    flex: 1;
    padding: 0px 50px;
    ${mobile({ padding: "10px" })}
  `;

  const Title = styled.h1`
    font-weight: 200;
  `;

  const Desc = styled.p`
    margin: 20px 0px;
  `;

  const Price = styled.span`
    font-weight: 100;
    font-size: 40px;
  `;

  return (
    <div>
      <Container>
        <NavBar />
        <Wrapper>
          <ImageListItem
            sx={{ height: "50px", width: "500px" }}
            key={itemDetails.ItemId}
          >
            <img
              src={itemDetails.ItemImage}
              name={itemDetails.ItemId}
              alt={itemDetails.ItemName}
              // onClick={displayProduct}
            />
            <ImageListItemBar
              sx={{ position: "top", backgroundColor: "transparent" }}
              actionIcon={<Favourite data={itemDetails}></Favourite>}
            />
          </ImageListItem>
          <InfoContainer>
            <Title>{itemDetails.ItemName}</Title>
            <p>{itemDetails.QuantitySold} Sales</p>
            <Desc>{itemDetails.Description}</Desc>
            <Price>
              {currencySymbol} {itemDetails.Price}
            </Price>
            <Container>
              <h3>
                <label for="qty">Quantity</label>
              </h3>

              <select
                onChange={handleCount}
                value={quantity}
                style={{ width: "60%" }}
              >
                {qtyarray.map((num) => (
                  <option>{num}</option>
                ))}
              </select>
            </Container>
            <br />
            <br />
            <Container>
              <Button
                variant="dark"
                type="submit"
                style={{ height: "40px", width: "600px" }}
              >
                Buy it Now
              </Button>
            </Container>
            <br />
            <br />
            <Container>
              <Button
                variant="dark"
                type="submit"
                style={{ height: "40px", width: "600px" }}
                onClick={handleAddToCart}
              >
                Add To Cart
              </Button>
            </Container>
          </InfoContainer>
        </Wrapper>
        {/* <Footer /> */}
      </Container>
      <div className="footer--pin">
        <Footer setcurrencyValue={setcurrencyValue} />
      </div>
    </div>
  );
};

export default Product;
