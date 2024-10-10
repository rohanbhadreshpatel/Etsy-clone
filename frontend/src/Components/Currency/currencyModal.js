import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import CurrencyForm from "./currencyForm";
import EuroIcon from "@mui/icons-material/Euro";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
function CurrencyModal({ setCurrencyValue }) {
  const [showLogin, setShowLogin] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);
  const [currencyvalue, setcurrencyvalue] = useState("USD");

  setCurrencyValue(currencyvalue);
  return (
    <>
      <div style={{lineHeight:"80px"}}>
        <Button variant="outline-light" size="lg" onClick={handleShowLogin}>
          Change Currency <CurrencyRupeeIcon />
          <MonetizationOnIcon />
          <EuroIcon />
        </Button>
      </div>

      <Modal show={showLogin} onHide={handleCloseLogin}>
        <Modal.Header closeButton>
          <Modal.Title>Update your settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CurrencyForm setcurrencyvalue={setcurrencyvalue} />
        </Modal.Body>
      </Modal>
    </>
  );
}
// render(<Home />);
export default CurrencyModal;
