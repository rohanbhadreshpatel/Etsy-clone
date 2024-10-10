import React, { Component } from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Form,
  FormControl,
  Dropdown,
  NavLink,
} from "react-bootstrap";
import LoginSignupButton from "../Pages/LoginSignupButton";
import LogoutSignoutButton from "../Pages/LogoutSignoutButton";
import cookie from "react-cookies";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchBar from "material-ui-search-bar";

function NavBar() {
  const [searchEntry, setSearchEntry] = useState("");
  const navigate = useNavigate();
  let LoginOutButton = null;
  let Favourite = null;
  let StoreIcn = null;

  if (cookie.load("cookie")) {
    // console.log("Able to read cookie");
    Favourite = (
      <div>
        <Nav.Link className="border-left pl-2 ms-auto" href="/favourite">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="currentColor"
            className="bi bi-heart"
            viewBox="0 0 16 14"
          >
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
          </svg>
        </Nav.Link>
      </div>
    );
    StoreIcn = (
      <div>
        <Nav.Link className="border-left pl-2 ms-auto" href="/your-shop">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="currentColor"
            class="bi bi-shop-window"
            viewBox="0 0 16 16"
          >
            <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h12V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zm2 .5a.5.5 0 0 1 .5.5V13h8V9.5a.5.5 0 0 1 1 0V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a.5.5 0 0 1 .5-.5z" />
          </svg>
        </Nav.Link>
      </div>
    );
    LoginOutButton = (
      <Dropdown className="border-left pl-2 ms-auto">
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="currentColor"
            className="bi bi-person-fill"
            viewBox="0 0 16 16"
          >
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          </svg>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="/profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="bi bi-person-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
            &nbsp;&nbsp;&nbsp;View Profile
          </Dropdown.Item>
          <Dropdown.Item href="/home">
            <LogoutSignoutButton />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  } else {
    // console.log("Not able to read cookie");
    LoginOutButton = (
      <Nav.Link className="border-left pl-2 ms-auto" href="">
        <LoginSignupButton />
      </Nav.Link>
    );
  }

  const handleSearchClick = () => {
    if (searchEntry.length > 0) {
      navigate("/search-page", {
        state: searchEntry,
      });
    }
  };
  // const handleSearchChange = (event) => {
  //   setSearchEntry(event.target.value);
  // };
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/home">
            <h1 style={{ color: "#f1641d" }}>&nbsp;&nbsp;&nbsp; Etsy</h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="container-fluid"
              style={{ maxHeight: "100px" }}
              navbarScroll
              //className="ml-auto"
            >
              {/* <Form className="d-flex ms-auto">
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="form-control-lg me-2"
                  aria-label="Search"
                  onChange={handleSearchChange}
                />
                <Button variant="light" size="sm" onClick={handleSearchClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </Button>
              </Form> */}
              <SearchBar
                placeholder="Search for anything"
                className="d-flex ms-auto"
                value={searchEntry}
                onChange={(newValue) => setSearchEntry(newValue)}
                onRequestSearch={handleSearchClick}
              />
              {LoginOutButton}
              {StoreIcn}
              &nbsp;&nbsp;&nbsp;
              {Favourite}
              &nbsp;&nbsp;&nbsp;
              <Nav.Link href="/cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  fill="currentColor"
                  className="bi bi-cart4"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                </svg>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Navbar className="justify-content-center" bg="light" expand="lg">
        <Nav style={{ fontSize: "12px" }}>
          <Nav.Item>
            <Nav.Link href="/home">Home Favorites</Nav.Link>
          </Nav.Item>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Nav.Item>
            <Nav.Link href="/home">Jewelry & Accessories</Nav.Link>
          </Nav.Item>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Nav.Item>
            <Nav.Link href="/home">Clothing & Shoes</Nav.Link>
          </Nav.Item>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Nav.Item>
            <Nav.Link href="/home">Home & Living</Nav.Link>
          </Nav.Item>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Nav.Item>
            <Nav.Link href="/home">Wedding & Party</Nav.Link>
          </Nav.Item>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Nav.Item>
            <Nav.Link href="/home">Toys & Entertainment</Nav.Link>
          </Nav.Item>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Nav.Item>
            <Nav.Link href="/home">Art & Collectibles</Nav.Link>
          </Nav.Item>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Nav.Item>
            <Nav.Link href="/home">Craft Supplies</Nav.Link>
          </Nav.Item>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Nav.Item>
            <Nav.Link href="/home">Gifts & Gift Cards</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>
    </>
  );
}

// render(<Home />);
export default NavBar;
