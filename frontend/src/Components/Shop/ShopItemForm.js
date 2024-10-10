import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { API } from "../../backend";

function ShopItemForm(props) {
  const [itemForm, setItemForm] = useState({
    ItemName: "",
    Category: "",
    QuantityAvailable: "",
    Price: "",
    Description: "",
    ItemImage: "",
  });

  const handleChange = async (event) => {
    if (event.target.name === "ItemImage" && event.target.files[0]) {
      var itemPhoto = event.target.files[0];
      var data = new FormData();
      data.append("photos", itemPhoto);
      let response = await axios.post(API + "/item/upload-photo", data);
      console.log(response.data);
      setItemForm({
        ...itemForm,
        ItemImage: response.data,
        ShopId: props.data.ShopId.toString(),
      });
    } else {
      setItemForm({
        ...itemForm,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    console.log(itemForm.ShopId);
    await axios.post(API + "/item/add", itemForm);
    window.location.reload(false);
  };
  return (
    <div>
      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Item Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleItemSubmit}>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column sm={4}>
                Item Name
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="ItemName"
                  type="text"
                  placeholder="Item Name"
                  onChange={handleChange}
                  value={itemForm.ItemName}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column sm={4}>
                Category
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="Category"
                  type="text"
                  placeholder="Category"
                  onChange={handleChange}
                  value={itemForm.Category}
                  required
                  list="categoryList"
                />
                <datalist id="categoryList">
                  <option value="Clothing" />
                  <option value="Jewellery" />
                  <option value="Entertainment" />
                  <option value="Home Decor" />
                  <option value="Art" />
                </datalist>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column sm={4}>
                Quantity
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="QuantityAvailable"
                  type="number"
                  min={"0"}
                  placeholder="Quantity"
                  value={itemForm.QuantityAvailable}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column sm={4}>
                Price
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="Price"
                  type="number"
                  step={"0.01"}
                  min={"0"}
                  placeholder="Price"
                  value={itemForm.Price}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column sm={4}>
                Description
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="Description"
                  as="textarea"
                  rows={3}
                  placeholder="Description"
                  onChange={handleChange}
                  value={itemForm.Description}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-2">
              <Form.Label column sm={4}>
                Image
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="ItemImage"
                  type="file"
                  onChange={handleChange}
                  required
                />
              </Col>
            </Form.Group>
            <Button variant="dark" type="submit" onSubmit={handleItemSubmit}>
              Submit
            </Button>
            <Button variant="dark" onClick={props.onHide}>
              Close
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ShopItemForm;
