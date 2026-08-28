import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:9091/orders/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load orders");
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          padding: "40px",
          color: "white",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "40px",
            fontSize: "42px",
          }}
        >
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              marginTop: "100px",
            }}
          >
            <h2>No Orders Found</h2>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "#1e293b",
                borderRadius: "16px",
                padding: "25px",
                marginBottom: "25px",
                border: "1px solid #334155",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      color: "#38bdf8",
                    }}
                  >
                    Order #{order.id}
                  </h2>

                  <p
                    style={{
                      color: "#cbd5e1",
                      marginTop: "8px",
                    }}
                  >
                    {new Date(order.orderDate).toLocaleString()}
                  </p>
                </div>

                <div
                  style={{
                    background: "#16a34a",
                    padding: "8px 15px",
                    borderRadius: "20px",
                    height: "fit-content",
                    fontWeight: "bold",
                  }}
                >
                    Paid
                </div>
              </div>

              <hr
                style={{
                  border: "1px solid #334155",
                  marginBottom: "20px",
                }}
              />

              <h3
                style={{
                  marginBottom: "15px",
                }}
              >
                Products
              </h3>

              {order.items?.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#334155",
                    borderRadius: "10px",
                    padding: "15px",
                    marginBottom: "12px",
                  }}
                >
                  <h4
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    {item.product?.productName}
                  </h4>

                  <p>Quantity : {item.quantity}</p>

                  <p>Price : ₹{item.price}</p>
                </div>
              ))}

              <div
                style={{
                  textAlign: "right",
                  marginTop: "20px",
                }}
              >
                <h2
                  style={{
                    color: "#22c55e",
                  }}
                >
                  Total : ₹{order.totalAmount}
                </h2>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Orders;