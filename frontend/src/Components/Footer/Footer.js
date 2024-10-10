import React, { useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import CurrencyModal from "../Currency/currencyModal";
import CopyrightIcon from "@mui/icons-material/Copyright";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

function Footer({ setcurrencyValue }) {
  const [currencyvalue, setCurrencyValue] = useState("USD");

  setcurrencyValue(currencyvalue);

  return (
    <>
      {/* <div className="grid-child green">
        <div id="content" className="clear " role="main">
          <link
            rel="stylesheet"
            href="https://www.etsy.com/ac/primary/css/base.20220304135846.css"
            type="text/css"
          />
        </div>
      </div> */}
      <div
        style={{
          background: "#4c6bc6",
          fontFamily: "Times New Roman",
          textAlign: "center",
          lineHeight: "50px",
          height: "50px",
          color: "white",
          fontSize: "16px",
        }}
      >
        Etsy is powered by 100% renewable electricity.
      </div>
      {/* <div
        style={{
          background: "#2f456c",
          height: "300px",
        }}
      >
        <div
          style={{
            width: "100%",
            paddingTop: "30px",
            paddingLeft: "100px",
          }}
        >
          <table
            style={{
              fontFamily: "Times New Roman",
              fontSize: "16px",
              color: "white",
              width: "100%",
            }}
          >
            <thead style={{ fontSize: "18px" }}>
              <tr>
                <th>Shop</th>
                <th>Sell</th>
                <th>About</th>
                <th>Help</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gift cards</td>
                <td>Seller handbook</td>
                <td>Etsy, Inc.</td>
                <td>Help Center</td>
              </tr>
              <tr>
                <td>Sitemap</td>
                <td>Teams</td>
                <td>Policies</td>
                <td>Trust and safety</td>
              </tr>
              <tr>
                <td>Etsy blog</td>
                <td>Forums</td>
                <td>Investors</td>
                <td>Privacy settings</td>
              </tr>
              <tr>
                <td></td>
                <td>Affiliates</td>
                <td>Careers</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>Press</td>
                <td>
                  <Button variant="outline-light" size="md">
                    Download the Etsy App
                  </Button>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>Impact</td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <InstagramIcon />
                  &nbsp;&nbsp;&nbsp;
                  <FacebookIcon />
                  &nbsp;&nbsp;&nbsp;
                  <PinterestIcon />
                  &nbsp;&nbsp;&nbsp;
                  <TwitterIcon />
                  &nbsp;&nbsp;&nbsp;
                  <YouTubeIcon />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
      <Navbar
        variant="dark"
        expand="sm"
        style={{ height: "80px", backgroundColor: "#232347" }}
      >
        <Container fluid>
          {/* <Navbar.Brand href="#">
            <h2 style={{ color: "red" }}>&nbsp;&nbsp;&nbsp; Etsy</h2>
          </Navbar.Brand> */}
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="container-fluid"
              style={{ maxHeight: "100px" }}
              navbarScroll
              //className="ml-auto"
            >
              <Nav.Link>
                <CurrencyModal setCurrencyValue={setCurrencyValue} />
              </Nav.Link>
              <Navbar.Text
                className="border-left pl-2 ms-auto"
                style={{ color: "white", fontSize: "15px", lineHeight: "80px" }}
              >
                <CopyrightIcon /> 2022 Etsy, inc.
              </Navbar.Text>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
// render(<Home />);
export default Footer;
