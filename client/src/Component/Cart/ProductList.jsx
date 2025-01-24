import React from "react";
import { useCart } from "../Context/CartContext";

const ProductList = ({ products }) => {
    const { addToCart } = useCart();

    return (
        <div>
            <h1>Products</h1>
            {products.map((product) => (
                <div key={product.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                    <h2>{product.name}</h2>
                    <p>Price: ${product.price}</p>
                    <button onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
