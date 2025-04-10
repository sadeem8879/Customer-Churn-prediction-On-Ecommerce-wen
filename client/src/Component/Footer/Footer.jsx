import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "./Footer.css"; // Ensure CSS file is linked properly

const Footer = () => {
    return (
        <footer className="footer mt-5" >
            <Container>
                <Row className="footer-row">
                    {/* Left Section */}
                    <Col md={4} className="footer-brand">
                        <h5>E-Commerce</h5>
                        <p>Your one-stop destination for trendy fashion, accessories, and cosmetics.</p>
                    </Col>

                    {/* Middle Section - Quick Links */}
                    <Col md={4} className="footer-links text-center">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <Container>
                                {/* Row 1: Home & Men */}
                                <Row>
                                    <Col lg={6}><li><a href="/">Home</a></li></Col>
                                    <Col lg={6}><li><a href="/mens">Men</a></li></Col>
                                </Row>
                                {/* Row 2: Women & Kids */}
                                <Row>
                                    <Col lg={6}><li><a href="/womens">Women</a></li></Col>
                                    <Col lg={6}><li><a href="/kids">Kids</a></li></Col>
                                </Row>
                                {/* Row 3: Accessories & Cosmetics (Centered) */}
                                <Row className="justify-content-center">
                                    <Col lg={6} className="text-center"><li><a href="/accessories">Accessories</a></li></Col>
                                    <Col lg={6} className="text-center"><li><a href="/cosmetics">Cosmetics</a></li></Col>
                                </Row>
                            </Container>
                        </ul>
                    </Col>

                    {/* Right Section - Social Media */}
                    <Col md={4} className="footer-social text-center">
                        <h5>Follow Us</h5>
                        <div className="social-icons">
                            <a href="#"><i className="fa-brands fa-facebook"></i></a>
                            <a href="#"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#"><i className="fa-brands fa-twitter"></i></a>
                            <a href="#"><i className="fa-brands fa-behance"></i></a>
                            <a href="#"><i className="fa-brands fa-linkedin"></i></a>
                        </div>
                    </Col>
                </Row>

                <hr className="footer-divider" />

                {/* Copyright Section */}
                <Row>
                    <Col className="text-center">
                        <p className="footer-copy">&copy; 2025 E-Commerce. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
