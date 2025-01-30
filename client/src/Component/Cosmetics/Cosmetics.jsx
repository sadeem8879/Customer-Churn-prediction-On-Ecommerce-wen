import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Container, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// import ProductList from '../productList'; // Correct import
// import { useCart } from '../../Context/CartContext';
const Cosmetics = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch products from the API
  useEffect(() => {
    axios.get('http://localhost:8080/cosmetics')
      .then(response => {
        console.log('API Response:', response.data);
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  let parsedUserId;

  const handleAddToCart = async (product, productType) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate('/login');
      return;
    }

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      console.error("Invalid user ID:", userId);
      return;
    }

    if (!productType) {
      console.error("Invalid productType:", productType);
      return;
    }

    let productIdField;
    switch (productType) {
      case "MenProduct":
        productIdField = "menProductId";
        break;
      case "WomenProduct":
        productIdField = "womenProductId";
        break;
      case "KidsProduct":
        productIdField = "kidsProductId";
        break;
      case "AccessoriesProduct":
        productIdField = "accessoriesProductId";
        break;
      case "CosmeticsProduct":
        productIdField = "cosmeticsProductId";
        break;
      default:
        console.error("Invalid product type:", productType);
        return;
    }
    if (!productIdField) {
      console.error("productIdField is undefined. Check productType:", productType)
      return;
    }
    const cartItem = {
      userId: parsedUserId,
      quantity: 1,
      productType: productType,
      [productIdField]: product.id, // Use the correct field name
    };

    console.log("Data being sent to backend:", JSON.stringify(cartItem, null, 2));

    try {
      const response = await axios.post("http://localhost:8080/cart", cartItem);
      console.log("Product added to cart:", response.data);
      alert(`${product.name} added to cart`);
    } catch (error) {
      console.error("Error adding product to cart:", error.response ? error.response.data : error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      }
    }
  };
  const handleBuyNow = (product, productType) => {
    navigate('/product', { state: { product: { ...product, productType }, quantity: 1 } });
  };

  return (
    <Container>
      <Row>
        {products.map(product => (
          <Col lg={4} md={6} sm={12} key={product.id}>
            <Card style={{ width: '18rem', height: '34rem' }} className="mt-4 shadow">
              <Card.Img width={100} height={300} variant="top" src={`http://localhost:8080${product.imageUrl}`} />
              <Card.Body className="shadow border">
                <Card.Title><h3>{product.name}</h3></Card.Title>
                <Card.Text>
                  <div>
                    <p>{product.description ? (product.description.length > 50 ? product.description.slice(0, 65) + '...' : product.description) : 'No description available.'}</p>
                    <p>{product.price}</p>
                  </div>
                </Card.Text>
                <Button
                  variant="primary"
                  className="btn btn-success"
                  onClick={() => handleAddToCart(product, "CosmeticsProduct")}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="primary"
                  className="btn btn-danger ms-5"
                  onClick={() => handleBuyNow(product,"CosmeticsProduct")}
                >
                  Buy Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Cosmetics;