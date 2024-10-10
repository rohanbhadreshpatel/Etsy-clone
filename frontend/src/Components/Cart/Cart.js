import React from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import { useState } from "react";
import { Button } from "react-bootstrap";
import EuroIcon from "@mui/icons-material/Euro";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import "./Cart.css";
import { useDispatch, useSelector } from "react-redux";
import { mobile } from "../../responsive";
import styled from "styled-components";
import StripeCheckout from "react-stripe-checkout";
import { Add, Remove } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { purchase } from "../../Redux/purchaseRedux";
import moment from "moment";
import cookie from "react-cookies";
import Profile from "../Profile/Profile";
import { API } from "../../backend";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
`;

const TopTexts = styled.div`
  ${mobile({ display: "none" })}
`;
const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span`
  font-size: 24px;
`;

const ProductId = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

// const Button = styled.button`
//   width: 100%;
//   padding: 10px;
//   background-color: black;
//   color: white;
//   font-weight: 600;
// `;
const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [currencyvalue, setcurrencyValue] = useState("USD");
  const itemDetails = cart.products;
  const ProfileId = cookie.load("cookie");
  const handleContinue = () => {
    navigate("/home");
  };
  // console.log("TEST MESSAGE: " + JSON.stringify(cart.products[1]));
  const handleCheckout = () => {
    if (cookie.load("cookie")) {
      var temp = JSON.parse(JSON.stringify(itemDetails));
      console.log(temp);
      temp[0].ProfileId = ProfileId;
      // console.log([temp]);
      // for (var i = 0; i < itemDetails.length; i++) {
      axios.post( API + "/purchase", [temp]).then((response) => {
        console.log(response.data);
      });
      axios
        .post( API + "/updatequantity", [temp])
        .then((response) => {
          console.log(response.data);
        });
      navigate("/orderhistory");
    } else {
      alert("Please Sign in to Proceed to Checkout!");
    }
  };

  return (
    <div>
      <NavBar>New navigation</NavBar>
      <Wrapper>
        <Title>YOUR CART</Title>
        <Top>
          <TopButton onClick={handleContinue}>CONTINUE SHOPPING</TopButton>
          <TopButton onClick={handleCheckout} type="filled">
            CHECKOUT NOW
          </TopButton>
        </Top>
        <Bottom>
          <Info>
            {cart.products.map((product, index) => (
              <Product>
                <ProductDetail>
                  <img
                    style={{ height: 250, width: 250 }}
                    src={product.ItemImage}
                    alt={product.ItemName}
                  ></img>
                  <Details>
                    <ProductName>
                      <b>{product.ItemName}</b>
                      <p>{product.Description}</p>
                    </ProductName>
                  </Details>
                </ProductDetail>
                <PriceDetail>
                  <ProductAmountContainer>
                    <ProductAmount>
                      <b>Quantity: </b>
                      {product.quantity}
                    </ProductAmount>
                  </ProductAmountContainer>
                  <ProductPrice>
                    $ {product.Price * product.quantity}
                  </ProductPrice>
                </PriceDetail>
              </Product>
            ))}
            <Hr />
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>$ 5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>$ -5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            <TopButton onClick={handleCheckout} type="filled">
              CHECKOUT
            </TopButton>
          </Summary>
        </Bottom>
      </Wrapper>
      {/* <div className="content-container">
        <div>
          <div className="wrap cf">
            <div className="heading cf">
              <h1>My Cart</h1>
            </div>
            <div className="cart">
              <ul className="cartWrap">
                <li>
                  <img src={cart.products[0].ItemImage}></img>
                </li>
                <li>Item 2</li>
              </ul>
            </div>

            <div className="subtotal cf">
              <ul>
                <li className="totalRow final">
                  <span className="label">Total</span>
                  <span className="value"></span>
                </li>
                <li className="totalRow">
                  <Button
                    variant="dark"
                    type="submit"
                    style={{ height: "40px", width: "300px" }}
                    onClick={handleCheckout}
                  >
                    Proceed to checkout
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer--pin">
          <Footer setcurrencyValue={setcurrencyValue} />
        </div>
      </div> */}
    </div>
  );
};

export default Cart;
