import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import axios from "axios"; // Importing axios
// import react,useState from "react"
import { useState } from "react";

const Buynow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  // If no product is selected for checkout
  if (!product) {
    return <div className="text-center my-5">No product selected for checkout.</div>;
  }

  // State to hold the quantity and form data (user's information)
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    paymentMethod: "Credit Card",
  });

  // Handle quantity change (increment or decrement)
  const handleQuantityChange = (delta) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + delta));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission (checkout)
  // const handleCheckout = async (e) => {
  //   e.preventDefault();
  //   // const { productType } = product;


  //   // Prepare the data to be sent to the backend
  //   const orderData = {
  //     productId: product.id,
  //     productType: product.productType, // Assuming you have a `type` field in the product
  //     quantity: quantity,
  //     name: formData.name,
  //     email: formData.email,
  //     address: formData.address,
  //     paymentMethod: formData.paymentMethod,
  //   };

  //   console.log("Sending order data:", orderData); // Log the data to verify


  //   try {
  //     const response = await axios.post("http://localhost:8080/buynow", orderData);
  //     if (response.status === 201) {
  //       navigate("/order-success", { state: { orderId: response.data.orderId } });
  //     }
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     // Display the error response to understand what went wrong
  //     console.error("Error response:", error.response?.data);
  //   }
  // };
  // const handleCheckout = async (e) => {
  //   e.preventDefault();

  //   // Ensure you're accessing the correct productType from the passed state
  //   const orderData = {
  //     productId: product.id,
  //     productType: product.productType, // Corrected field
  //     quantity: quantity,
  //     name: formData.name,
  //     email: formData.email,
  //     address: formData.address,
  //     paymentMethod: formData.paymentMethod,
  //   };

  //   console.log("Sending order data:", orderData); // Log to verify

  //   try {
  //     axios.post('http://localhost:8080/buynow', orderData)
  //     .then(response => {
  //       alert('Order placed successfully:', response.status);

  //     })
  //     .catch(error => {
  //       console.error('Error placing order:', error.response ? error.response.data : error.message);
  //     });

  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     console.error("Error response:", error.response?.data);
  //   }
  // };


  // Calculate the total price based on quantity
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.address || !formData.mobileNumber) {
      alert("All fields are required.");
      return;
    }

    const orderData = {
      productId: product.id,
      productType: product.productType,
      quantity,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobileNumber, // ✅ Fixed key
      address: formData.address,
      paymentMethod: formData.paymentMethod,
    };
    console.log("Sending order data:", orderData);

    try {
      const response = await axios.post('http://localhost:8080/buynow', orderData);
      if (response.status === 201) {
        alert('Order placed successfully!');
        navigate("/order-success", { state: { orderId: response.data.orderId } });
      }
    } catch (error) {
      console.error("Error placing order:", error.response ? error.response.data : error.message);
    }
  };


  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="p-4 shadow">
            <Row>
              <Col md={6} className="d-flex justify-content-center">
                <img
                  src={`http://localhost:8080${product.imageUrl}`} // Make sure the image URL is correct
                  alt={product.name}
                  style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
                />
              </Col>
              <Col md={6}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="d-flex align-items-center my-3">
                  <strong className="me-3">Quantity:</strong>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity === 1}
                  >
                    -
                  </Button>
                  <span className="mx-3">{quantity}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                  >
                    +
                  </Button>
                </div>
                <h5>
                  Price: <span className="text-success">${product.price}</span>
                </h5>
                <h5>
                  Total: <span className="text-danger">${totalPrice}</span>
                </h5>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row className="mt-5 justify-content-center">
        <Col lg={8}>
          <Card className="p-4 shadow">
            <h4 className="mb-4">Shipping & Payment Details</h4>
            <Form onSubmit={handleCheckout}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter Mobile No."
                  name="mobileNumber" // 🚨 This should match the key in formData
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                />

              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Shipping Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Proceed to Buy Now
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Buynow;

