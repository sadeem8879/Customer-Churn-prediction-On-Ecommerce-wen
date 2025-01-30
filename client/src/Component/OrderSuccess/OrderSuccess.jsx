import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Table, Button } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Mock API call to fetch order details (Replace with actual API call)
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/order"); // Example API
                if (!response.ok) throw new Error("Failed to fetch order details");
                const data = await response.json();
                setOrderDetails(data);
            } catch (error) {
                console.error("Error fetching order details:", error);
            }
        };

        fetchOrderDetails();

        // Redirect after 5 seconds
        const timer = setTimeout(() => {
            navigate("/");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
            <Card className="shadow p-4 text-center" style={{ maxWidth: "600px" }}>
                <CheckCircleFill size={60} className="text-success mb-3" />
                <h2 className="text-dark">Order Placed Successfully!</h2>
                <p className="text-muted">Thank you for your purchase. A confirmation email will be sent shortly.</p>

                {orderDetails ? (
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p className="text-muted">Loading order details...</p>
                )}

                <Button variant="primary" className="mt-3" onClick={() => navigate("/")}>
                    Return to Home
                </Button>
            </Card>
        </Container>
    );
};

export default OrderSuccess;
