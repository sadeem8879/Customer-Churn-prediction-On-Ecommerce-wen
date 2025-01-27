import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap'; // Import Button

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = parseInt(localStorage.getItem('userId'), 10);

        if (!userId) {
            navigate('/login');
            return;
        }

        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/cart/${userId}`);
                if (response.status === 200 && Array.isArray(response.data)) {
                    setCartItems(response.data);
                } else if (response.data && response.data.message) {
                    setMessage(response.data.message);
                } else {
                    setMessage("Error fetching cart.");
                }
            } catch (error) {
                console.error("Error fetching cart items:", error);
                setMessage("Error fetching cart.");
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [navigate]);

    const handleQuantityChange = async (itemId, delta) => {
        const updatedItems = cartItems.map(item =>
            item.id === itemId
                ? { ...item, quantity: Math.max(1, item.quantity + delta) } // Ensure quantity is never less than 1
                : item
        );
        setCartItems(updatedItems); // Optimistically update the UI
    
        try {
            const response = await axios.put(`http://localhost:8080/cart/${itemId}`, {
                quantity: updatedItems.find(item => item.id === itemId).quantity,
            });
    
            if (response.status !== 200) {
                console.error("Failed to update quantity on server:", response);
                setMessage("Failed to update quantity. Please try again.");
                setCartItems(cartItems); // Revert the UI update
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
            setMessage("Failed to update quantity. Please check your connection.");
            setCartItems(cartItems); // Revert the UI update
        }
    };
    
    const handleDeleteItem = async (cartId) => {
        try {
          const response = await axios.delete(`http://localhost:8080/cart/${cartId}`);
          if (response.status === 200) {
            console.log("Item deleted successfully:", response.data);
            setCartItems(cartItems.filter(item => item.id !== cartId));
          } else {
            console.error("Failed to delete item on server:", response);
            setMessage("Failed to delete item. Please try again.");
          }
        } catch (error) {
          console.error("Error deleting item:", error);
          setMessage("Failed to delete item. Please check your connection.");
        }
      };
      

    if (loading) {
        return <div>Loading cart...</div>;
    }

    if (message) {
        return <p className="text-danger">{message}</p>;
    }

    return (
        <div>
            <Table    responsive>
                <thead>
                    <tr>
                        <th>Sr no.</th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Total</th> {/* Added Total column */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className='shadow'>
                    {cartItems.map((item, index) => {
                        let product = null;

                        switch (item.productType) {
                            case "MenProduct": product = item.menProduct; break;
                            case "WomenProduct": product = item.womenProduct; break;
                            case "KidsProduct": product = item.kidsProduct; break;
                            case "AccessoriesProduct": product = item.accessoriesProduct; break;
                            case "CosmeticsProduct": product = item.cosmeticsProduct; break;
                            default: console.warn("Unknown product type:", item.productType, item); return null;
                        }

                        if (!product) {
                            console.warn("Product details NOT found for item:", item);
                            return null;
                        }

                        const itemTotal = (product.price * item.quantity).toFixed(2); // Calculate total

                        return (
                            <tr key={item.id} className='shadow'>
                                <td className='text-center shadow pt-'>{index + 1}</td>
                                <td >{product.imageUrl && <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} width="120" />}</td>
                                <td className='pt-4'>{product.name}<br />{product.description}</td>
                                <td className='pt-4'>${product.price}</td>
                                <td className='pt-4'>{item.productType}</td>
                                <td className='d-flex pt-4'>
                                    <Button className='ms-1' variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(item.id, -1)} disabled={item.quantity === 1}>-</Button>{' '}
                                    <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                                    <Button className='me-1' variant="outline-secondary" size="sm" onClick={() => handleQuantityChange(item.id, 1)}>+</Button>
                                </td>
                                <td className='pt-4'>${itemTotal}</td> {/* Display total */}
                                <td className='pt-4'><Button variant="danger" size="sm" onClick={() => handleDeleteItem(item.id)}><i className="fa-solid fa-trash"></i></Button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

export default Cart;