// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
// import { Container, Col, Row, Button } from 'react-bootstrap';

// const Checkout = () => {
//   const location = useLocation();
//   const navigate = useNavigate(); // Initialize useNavigate
//   const { product } = location.state || {};

//   if (!product) {
//     return <div>No product selected.</div>;
//   }

//   const [quantity, setQuantity] = useState(1); // Initialize with default quantity

//   const handleQuantityChange = (delta) => {
//     const newQuantity = quantity + delta;
//     if (newQuantity >= 1) {
//       setQuantity(newQuantity);
//     }
//   };

//   const total = product.price * quantity;

//   const handleBuyNow = (product,productType) => {
//     navigate('/buynow', {
//       state: {
//         // product,
//         product: {
//           ...product,
//           productType: product.productType ,// Ensure this is valid
//         },
//         quantity,
//         total,
//       },
//     }); // Pass product, quantity, and total as state
//   };

//   return (
//     <Container className="d-flex h-75 justify-content-center shadow align-items-center vh-100" style={{ backgroundColor: "white" }}>
//       <Row className="d-flex">
//         <Col lg={4} className="shadow">
//           <img src={`http://localhost:8080${product.imageUrl}`} className="mx-4" alt={product.name} width="260" height={370} />
//         </Col>
//         <Col className="mx-5 mt-5" lg={4}>
//           <h1>{product.name}</h1>
//           <p>{product.description}</p>
//           <div className="d-flex">
//             <h5 className="me-2 fs-5">Qty:</h5>
//             <Button variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(-1)} disabled={quantity === 1}>-</Button>{' '}
//             <span style={{ margin: "0 10px" }}>{quantity}</span>
//             <Button variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(1)}>+</Button>
//           </div>
//         </Col>
//         <Col style={{ marginLeft: "-96px" }} className="shadw ps-5 mt-5 pt-1" lg={4}>
//           <div className="d-flex">
//             <h3>Price: $</h3>
//             <p>{product.price}</p>
//           </div>
//           <div className="d-flex">
//             <h3 className="mt-2">Total: $</h3>
//             <p className="mt-2">{total.toFixed(2)}</p>
//           </div>
//           <Button variant="primary" className="ms-2 my-3" onClick={handleBuyNow(product,productType)}>
//             Buy Now
//           </Button>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// // export default Checkout;
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
// import { Container, Col, Row, Button } from 'react-bootstrap';

// const Checkout = () => {
//   const location = useLocation();
//   const navigate = useNavigate(); // Initialize useNavigate
//   const { product } = location.state || {};

//   if (!product) {
//     return <div>No product selected.</div>;
//   }

//   const [quantity, setQuantity] = useState(1); // Initialize with default quantity

//   const handleQuantityChange = (delta) => {
//     const newQuantity = quantity + delta;
//     if (newQuantity >= 1) {
//       setQuantity(newQuantity);
//     }
//   };

//   // Default productType if not present
//   // const productType = product.productType || 'object'; // Ensure productType is valid

//   const total = product.price * quantity;

//   const handleBuyNow = (product,productType) => {
//     navigate('/buynow', {
//       state: {
//         product: {
//           ...product,
//           productType: product.productType, // Ensure this is valid
//         },
//         quantity,
//         total,
//       },
//     });
//   };

//   return (
//     <Container className="d-flex h-75 justify-content-center shadow align-items-center vh-100" style={{ backgroundColor: "white" }}>
//       <Row className="d-flex">
//         <Col lg={4} className="shadow">
//           <img src={`http://localhost:8080${product.imageUrl}`} className="mx-4" alt={product.name} width="260" height={370} />
//         </Col>
//         <Col className="mx-5 mt-5" lg={4}>
//           <h1>{product.name}</h1>
//           <p>{product.description}</p>
//           <div className="d-flex">
//             <h5 className="me-2 fs-5">Qty:</h5>
//             <Button variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(-1)} disabled={quantity === 1}>-</Button>{' '}
//             <span style={{ margin: "0 10px" }}>{quantity}</span>
//             <Button variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(1)}>+</Button>
//           </div>
//         </Col>
//         <Col style={{ marginLeft: "-96px" }} className="shadw ps-5 mt-5 pt-1" lg={4}>
//           <div className="d-flex">
//             <h3>Price: $</h3>
//             <p>{product.price}</p>
//           </div>
//           <div className="d-flex">
//             <h3 className="mt-2">Total: $</h3>
//             <p className="mt-2">{total.toFixed(2)}</p>
//           </div>
//           <Button variant="primary" className="ms-2 my-3" onClick={handleBuyNowhandleBuyNow(product,productType)}}>
//             Buy Now
//           </Button>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Checkout;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Col, Row, Button } from 'react-bootstrap';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  // useEffect(() => {
  //  const productType = product.productType || 'object'; // Ensure productType is valid

  //   console.log('Selected Product:', product);
  //   console.log('Selected Product Type:', product?.productType); // Log to verify
  // }, [product]);
  useEffect(() => {
    console.log('Selected Product:', product);
    console.log('Selected Product Type:', product?.productType); // Ensure it's not undefined
  }, [product]);
  
  if (!product) {
    return <div>No product selected.</div>;
  }

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const total = product.price * quantity;

  const handleBuyNow = (product, productType) => {
    console.log('Sending order data:', { productId: product.id, productType, quantity });
    navigate('/buynow', {
      state: {
        product: {
          ...product,
          productType, // Make sure this is populated correctly
        },
        quantity,
        total,
      },
    });
  };

  return (
    <Container className="d-flex h-75 justify-content-center shadow align-items-center vh-100" style={{ backgroundColor: "white" }}>
      <Row className="d-flex">
        <Col lg={4} className="shadow">
          <img src={`http://localhost:8080${product.imageUrl}`} className="mx-4" alt={product.name} width="260" height={370} />
        </Col>
        <Col className="mx-5 mt-5" lg={4}>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="d-flex">
            <h5 className="me-2 fs-5">Qty:</h5>
            <Button variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(-1)} disabled={quantity === 1}>-</Button>{' '}
            <span style={{ margin: "0 10px" }}>{quantity}</span>
            <Button variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(1)}>+</Button>
          </div>
        </Col>
        <Col style={{ marginLeft: "-96px" }} className="shadw ps-5 mt-5 pt-1" lg={4}>
          <div className="d-flex">
            <h3>Price: $</h3>
            <p>{product.price}</p>
          </div>
          <div className="d-flex">
            <h3 className="mt-2">Total: $</h3>
            <p className="mt-2">{total.toFixed(2)}</p>
          </div>
          <Button variant="primary" className="ms-2 my-3" onClick={() => handleBuyNow(product, product.productType)}>
            Buy Now
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
