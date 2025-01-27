// import React from 'react';
// import { useCart } from '../../Context/CartContext';

// const ProductList = ({ product, productType }) => {
//     const { addToCart } = useCart();

//     const handleAddToCartClick = () => {
//         addToCart({ product, productType }); // Pass product and productType to addToCart
//     };

//     return (
//         <div>
//             {/* Display product information */}
//             <h3>{product.name}</h3>
//             <p>Price: ${product.price}</p>
//             {/* ... other product details */}
//             <button onClick={handleAddToCartClick}>Add to Cart</button>
//         </div>
//     );
// };

// export default ProductList;import React, { useEffect } from 'react';
import { useCart } from '../../Context/CartContext';
import { Table, Button } from 'react-bootstrap';

const ProductList = () => {
    const { cart, removeFromCart, fetchCart } = useCart(); // Include fetchCart

    useEffect(() => {
        fetchCart(); // Fetch cart on component mount and when cart changes
    }, [cart, fetchCart]);

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const product = item.menProduct || item.womenProduct || item.kidsProduct || item.accessoriesProduct || item.cosmeticsProduct;
            return total + (product?.price * item.quantity);
        }, 0);
    };

    return (
        <div>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => {
                                const product = item.menProduct || item.womenProduct || item.kidsProduct || item.accessoriesProduct || item.cosmeticsProduct;
                                if (!product) return null;

                                const itemTotal = (product.price * item.quantity).toFixed(2);

                                return (
                                    <tr key={item.id}>
                                        <td>
                                            <img
                                                src={`http://localhost:8080${product.imageUrl}`}
                                                alt={product.name}
                                                style={{ width: '50px' }}
                                            />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>${product.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>${itemTotal}</td>
                                        <td>
                                            <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    <h4>Total: ${calculateTotal().toFixed(2)}</h4>
                </div>
            )}
        </div>
    );
};

export default ProductList;