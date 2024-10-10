import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";

function LoginSignupButton() {
  const [showLogin, setShowLogin] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const [showSignup, setShowSignup] = useState(false);
  const handleShowSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };
  const handleCloseSignup = () => setShowSignup(false);

  return (
    <>
      <div>
        <Button variant="outline-dark" size="lg" onClick={handleShowLogin}>
          Sign in
        </Button>
      </div>

      <Modal show={showLogin} onHide={handleCloseLogin}>
        <Modal.Header closeButton>
          <Modal.Title>
            Login &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            <Button variant="outline-dark" size="md" onClick={handleShowSignup}>
              {" "}
              Register
            </Button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login />
        </Modal.Body>
      </Modal>

      <Modal show={showSignup} onHide={handleCloseSignup}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4>Create your account </h4>
            <h6>Registartion is easy.</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Signup />
        </Modal.Body>
      </Modal>
    </>
  );
}
// render(<Home />);
export default LoginSignupButton;