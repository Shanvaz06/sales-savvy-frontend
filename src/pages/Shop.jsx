import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:9090",
  });

  const loadProducts = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const response = await api.get("/products/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProducts(response.data);
  } catch (error) {
    console.error("Error loading products:", error);

    console.log("STATUS:", error.response?.status);
    console.log("RESPONSE:", error.response?.data);

    if (error.response?.status === 401 || error.response?.status === 403) {
      alert("Unauthorized. Login again");
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      alert("Failed to load products");
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  loadProducts();
}, []);

  const addToCart = (product) => {
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = existingCart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      if (existingProduct.cartQuantity < product.quantity) {
        existingProduct.cartQuantity += 1;
      } else {
        alert("Maximum available quantity reached");
        return;
      }
    } else {
      existingCart.push({
        ...product,
        cartQuantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    alert(`${product.productName} added to cart`);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#111827",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
        }}
      >
        Loading products...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h1 style={{ margin: 0 }}>Sales Savvy Shop</h1>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "#374151",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Dashboard
          </button>
        </div>

        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "#1f2937",
                  borderRadius: "10px",
                  padding: "20px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                }}
              >
                <h2 style={{ marginTop: 0 }}>
                  {product.productName}
                </h2>

                <p>
                  <strong>Price:</strong> ₹{product.price}
                </p>

                <p>
                  <strong>Available:</strong> {product.quantity}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {product.category?.categoryName ||
                    product.category?.id ||
                    "-"}
                </p>

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.quantity <= 0}
                  style={{
                    width: "100%",
                    background:
                      product.quantity > 0
                        ? "#2563eb"
                        : "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "6px",
                    cursor:
                      product.quantity > 0
                        ? "pointer"
                        : "not-allowed",
                    marginTop: "10px",
                  }}
                >
                  {product.quantity > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: "35px",
          }}
        >
          <button
            onClick={() => navigate("/checkout")}
            style={{
              background: "#16a34a",
              color: "white",
              border: "none",
              padding: "12px 25px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Go to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Shop;