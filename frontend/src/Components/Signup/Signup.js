import { React, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { API } from "../../backend";


const Signup = () => {
  const [formValue, setformValue] = useState({
    email: "",
    name: "",
    password: "",
  });

  const handleSubmit = (event) => {
    var data = {
      email: formValue.email,
      password: formValue.password,
      name: formValue.name,
    };
    axios.post( API + "/signup", data).then((response) => {
      if (response.status === 200) {
        Alert("");
      }
    });
  };

  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="text"
          name="email"
          placeholder="Enter email"
          value={formValue.email}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          placeholder="Name"
          value={formValue.name}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder="Password"
          value={formValue.password}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <div className="d-grid gap-2 rounded-circle">
        <Button variant="dark" size="lg" type="submit" onClick={handleSubmit}>
          Signup
        </Button>
      </div>
    </Form>
  );
};
export default Signup;
