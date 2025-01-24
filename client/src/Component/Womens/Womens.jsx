import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container, Col, Row } from 'react-bootstrap';
const Womens = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/womens')
      .then(response => {
        console.log('API Response:', response.data);
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <>
      <Container>
        <Row>
          {products.map(product => (
            <Col lg={4} md={6} sm={12}>
              <Card style={{ width: '18rem', height: '34rem' }} className="mt-4 shadow" >
                <Card.Img width={100} height={300} variant="top" src={`http://localhost:8080${product.imageUrl}`} />
                <Card.Body className='shadow border'>
                  <Card.Title> <h3>{product.name}</h3></Card.Title>
                  <Card.Text>
                    {/* <p>{truncateDescription(product.description)}</p> */}
                    <p>{product.description ? (product.description.length > 50 ? product.description.slice(0, 65) + '...' : product.description)
                      : 'No description available.'}
                    </p>
                    <p>{product.price}</p>

                  </Card.Text>
                  <Button variant="primary" className='btn btn-success'>Add to Cart</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container></>
  )
}

export default Womens
