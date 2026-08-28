import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:9091",
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
  <>
    <Navbar />

    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "52px",
            fontWeight: "bold",
            marginBottom: "40px",
          }}
        >
          Sales Savvy Shop
        </h1>

        {products.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            No products available.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "25px",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "#1e293b",
                  borderRadius: "18px",
                  padding: "22px",
                  border: "1px solid #334155",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                }}
              >
                <img
  src={product.imageUrl}
  alt={product.productName}
  style={{
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "20px",
  }}
/>

                <h2
                  style={{
                    fontSize: "24px",
                    marginBottom: "15px",
                  }}
                >
                  {product.productName}
                </h2>

                <p
                  style={{
                    fontSize: "26px",
                    fontWeight: "bold",
                    color: "#22c55e",
                  }}
                >
                  ₹{product.price}
                </p>

                <p
                  style={{
                    color: "#cbd5e1",
                  }}
                >
                  Stock: {product.quantity}
                </p>

                <p
                  style={{
                    color: "#94a3b8",
                    marginBottom: "20px",
                  }}
                >
                  Category: {product.category?.categoryName || "-"}
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
                    padding: "14px",
                    borderRadius: "10px",
                    cursor:
                      product.quantity > 0
                        ? "pointer"
                        : "not-allowed",
                    fontWeight: "bold",
                  }}
                >
                  {product.quantity > 0
                    ? "Add To Cart"
                    : "Out Of Stock"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          <button
            onClick={() => navigate("/checkout")}
            style={{
              background: "#16a34a",
              color: "white",
              border: "none",
              padding: "15px 35px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Go To Checkout
          </button>
        </div>
      </div>
    </div>
  </>
);
}

export default Shop;