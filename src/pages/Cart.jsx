import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateQuantity = (id, change) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newQty = item.cartQuantity + change;

        if (newQty > 0 && newQty <= item.quantity) {
          return {
            ...item,
            cartQuantity: newQty,
          };
        }
      }

      return item;
    });

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const totalAmount = cart.reduce(
    (total, item) =>
      total + item.price * item.cartQuantity,
    0
  );

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
            maxWidth: "1000px",
            margin: "auto",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              fontSize: "48px",
              marginBottom: "40px",
            }}
          >
            My Cart
          </h1>

          {cart.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                marginTop: "100px",
              }}
            >
              <div
                style={{
                  fontSize: "90px",
                }}
              >
                🛒
              </div>
              <br></br>

              <br></br>
              <h2>Cart is Empty</h2>

              <button
                onClick={() => navigate("/shop")}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "12px 25px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  marginTop: "15px",
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#1e293b",
                    borderRadius: "16px",
                    padding: "25px",
                    marginBottom: "20px",
                    border: "1px solid #334155",
                    boxShadow:
                      "0 8px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          marginBottom: "10px",
                        }}
                      >
                        {item.productName}
                      </h2>

                      <p
                        style={{
                          color: "#22c55e",
                          fontSize: "22px",
                          fontWeight: "bold",
                        }}
                      >
                        ₹{item.price}
                      </p>

                      <p
                        style={{
                          color: "#94a3b8",
                        }}
                      >
                        Stock Available :
                        {item.quantity}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            -1
                          )
                        }
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#ef4444",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                      >
                        -
                      </button>

                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        {item.cartQuantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            1
                          )
                        }
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#22c55e",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3>
                      Subtotal : ₹
                      {(
                        item.price *
                        item.cartQuantity
                      ).toLocaleString("en-IN")}
                    </h3>

                    <button
                      onClick={() =>
                        removeItem(item.id)
                      }
                      style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div
                style={{
                  background: "#1e293b",
                  borderRadius: "16px",
                  padding: "30px",
                  marginTop: "30px",
                  textAlign: "center",
                  border: "1px solid #334155",
                }}
              >
                <h2
                  style={{
                    fontSize: "32px",
                    color: "#22c55e",
                  }}
                >
                  Total : ₹
                  {totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </h2>

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    justifyContent: "center",
                    marginTop: "25px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() =>
                      navigate("/shop")
                    }
                    style={{
                      background: "#475569",
                      color: "white",
                      border: "none",
                      padding: "15px 25px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    Continue Shopping
                  </button>

                  <button
                    onClick={() =>
                      navigate("/checkout")
                    }
                    style={{
                      background: "#16a34a",
                      color: "white",
                      border: "none",
                      padding: "15px 25px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;