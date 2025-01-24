// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';
// import { Container, Col, Row } from 'react-bootstrap';
// import { useCart } from "../../Context/CartContext";


// const Mens = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:8080/mens')
//       .then(response => {
//         console.log('API Response:', response.data);
//         setProducts(response.data);
//       })
//       .catch(error => console.error('Error fetching products:', error));
//   }, []);
//   const { addToCart } = useCart();


//   return (
//     <>
//       <Container>
//         <Row>
//           {products.map(product => (
//             <Col lg={4} md={6} sm={12}>
//               <Card  style={{ width: '18rem', height: '34rem' }} className="mt-4 shadow" >
//                 <Card.Img width={100} height={300} variant="top" src={`http://localhost:8080${product.imageUrl}`} />
//                 <Card.Body className='shadow border'>
//                   <Card.Title> <h3>{product.name}</h3></Card.Title>
//                   <Card.Text>
//                     {/* <p>{truncateDescription(product.description)}</p> */}
//                     <p>{product.description ? (product.description.length > 50 ? product.description.slice(0, 65) + '...' : product.description)
//                       : 'No description available.'}      
//                      </p>
//                     <p>{product.price}</p>

//                   </Card.Text>
//                   <Button variant="primary" className='btn btn-success' onClick={() => addToCart(product)}>Add to Cart</Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default Mens;'

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Button, Card, Container, Col, Row } from 'react-bootstrap';
// import { useCart } from "../../Context/CartContext";
// import { useNavigate } from 'react-router-dom';  // To redirect to login if not logged in

// const Mens = () => {
//   const [products, setProducts] = useState([]);
//   const { addToCart } = useCart();
//   const navigate = useNavigate();  // Use this to navigate to the login page

//   // Assume we store the logged-in user's ID in localStorage or context
//   const userId = localStorage.getItem('userId');  // Or use your context to get the logged-in user ID

//   useEffect(() => {
//     axios.get('http://localhost:8080/mens')
//       .then(response => {
//         console.log('API Response:', response.data);
//         setProducts(response.data);
//       })
//       .catch(error => console.error('Error fetching products:', error));
//   }, []);

//   const handleAddToCart = (product) => {
//     if (!userId) {
//       // Redirect to login page if not logged in
//       navigate('/login');
//     } else {
//       // If logged in, add to cart
//       addToCart(product);
//     }
//   };

//   return (
//     <Container>
//       <Row>
//         {products.map(product => (
//           <Col lg={4} md={6} sm={12} key={product.id}>
//             <Card style={{ width: '18rem', height: '34rem' }} className="mt-4 shadow">
//               <Card.Img width={100} height={300} variant="top" src={`http://localhost:8080${product.imageUrl}`} />
//               <Card.Body className="shadow border">
//                 <Card.Title><h3>{product.name}</h3></Card.Title>
//                 <Card.Text>
//                   <p>{product.description ? (product.description.length > 50 ? product.description.slice(0, 65) + '...' : product.description) : 'No description available.'}</p>
//                   <p>{product.price}</p>
//                 </Card.Text>
//                 <Button variant="primary" className="btn btn-success" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default Mens;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Container, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Mens = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch products from the API
  useEffect(() => {
    axios.get('http://localhost:8080/mens')
      .then(response => {
        console.log('API Response:', response.data);
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage

    if (!userId) {
      navigate('/login'); // Redirect to login if user is not logged in
    } else {
      axios.post('http://localhost:8080/cart', {
        userId,
        productId: product.id,
        productType: 'mens', // Change this based on your product category
        quantity: 1,
      })
      .then(response => {
        alert(`${product.name} added to cart`);
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
      });
    }
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
                  <p>{product.description ? (product.description.length > 50 ? product.description.slice(0, 65) + '...' : product.description) : 'No description available.'}</p>
                  <p>{product.price}</p>
                </Card.Text>
                <Button variant="primary" className="btn btn-success" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Mens;
