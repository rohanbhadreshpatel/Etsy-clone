import { Form, Button } from "react-bootstrap";
import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Navigate } from "react-router";
import { API } from "../../backend";

// import Header from '../Header/Header';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      validationError: "",
    };
  }

  emailHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  passwordHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  loginSubmit = (e) => {
    e.preventDefault();

    var data = {
      email: this.state.email,
      password: this.state.password,
    };

    if (this.state.Email == "" || this.state.Password == "") {
      // this.setState({
      //   formValidationFailure: true,
      // });

      console.log("Form Error!");
    } else {
      axios.defaults.withCredentials = true;

      axios
        .post( API + "/login", data)
        .then((response) => {
          if (response.status === 200) {
            this.setState({
              validationError: false,
              // formValidationFailure: false,
            });
            window.location.href = "/home";
          }
        })
        .catch((err) => {
          if (err) {
            if (err.response.status === 201) {
              this.setState({
                validationError: true,
              });
              console.log("Error messagw", err.response.status);
            } else {
              this.setState({
                // errorRedirect: true,
              });
            }
          }
        });
    }
  };

  render() {
    // let redrirectVar = null;
    // if (cookie.load("cookie")) {
    //   redrirectVar = <Navigate to="/home" />;
    // }
    // if(this.state.errorRedirect){
    //   redrirectVar = <Navigate to="/error" />;
    // }
    let errorPanel = null;
    if (this.state.validationError) {
      errorPanel = (
        <div>
          <div className="alert alert-danger" role="alert">
            <strong>Wrong Email Password Combination</strong>
          </div>
        </div>
      );
    }
    return (
      <div>
        {/* {redrirectVar} */}
        <Form>
          {errorPanel}
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              id="email"
              type="email"
              onChange={this.emailHandler}
              required
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              id="password"
              type="password"
              onChange={this.passwordHandler}
              required
            />
          </Form.Group>
          <div className="d-grid gap-2 rounded-pill">
            <Button
              variant="dark"
              type="submit"
              size="lg"
              onClick={this.loginSubmit}
            >
              Login
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}
export default Login;
