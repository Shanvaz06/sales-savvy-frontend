import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.cartQuantity);
  }, 0);

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      if (cart.length === 0) {
        alert("Your cart is empty");
        navigate("/shop");
        return;
      }

      const response = await axios.post(
        "http://localhost:9091/payment/create-order",
        {
          amount: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payment = response.data;

      const options = {
        key: "rzp_test_TOoWRSL7X7maK7",

        amount: payment.amount * 100,

        currency: "INR",

        name: "Sales Savvy",

        description: "Purchase from Sales Savvy",

        order_id: payment.razorpayOrderId,

        handler: async function () {
          try {
            await axios.put(
              `http://localhost:9091/payment/success/${payment.id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const orderItems = cart.map((item) => ({
              productId: item.id,
              quantity: item.cartQuantity,
            }));

            await axios.post(
              "http://localhost:9091/orders/place",
              orderItems,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            localStorage.removeItem("cart");

            alert("Payment Successful. Order Placed!");

            navigate("/shop");
          } catch (error) {
            console.error(
              "Order creation failed:",
              error.response?.status,
              error.response?.data || error
            );

            alert(
              "Payment completed, but order creation failed"
            );
          }
        },

        prefill: {
          name: "Shaik",
          email: "test@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#22c55e",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch (error) {
      console.error(
        "Payment creation failed:",
        error.response?.status,
        error.response?.data || error
      );

      alert("Payment failed");
    }
  };

  if (cart.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Your Cart Is Empty
        </h2>

        <button
          onClick={() => navigate("/shop")}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "14px 28px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Go To Shop
        </button>
      </div>
    );
  }

  return (
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
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "42px",
            fontWeight: "700",
            marginBottom: "35px",
          }}
        >
          Secure Checkout
        </h1>

        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#1e293b",
              padding: "25px",
              marginBottom: "20px",
              borderRadius: "16px",
              border: "1px solid #334155",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            }}
          >
            <h2
              style={{
                color: "#f8fafc",
                marginBottom: "15px",
              }}
            >
              {item.productName}
            </h2>

            <p style={{ color: "#cbd5e1" }}>
              Price: ₹
              {Number(item.price).toLocaleString("en-IN")}
            </p>

            <p style={{ color: "#cbd5e1" }}>
              Quantity: {item.cartQuantity}
            </p>

            <p
              style={{
                color: "#22c55e",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              Subtotal: ₹
              {(
                Number(item.price) *
                Number(item.cartQuantity)
              ).toLocaleString("en-IN")}
            </p>
          </div>
        ))}

        <div
          style={{
            background: "#16a34a",
            padding: "25px",
            borderRadius: "16px",
            marginTop: "25px",
            textAlign: "center",
            boxShadow:
              "0 8px 20px rgba(22,163,74,0.4)",
          }}
        >
          <h2>
            Total Amount : ₹
            {total.toLocaleString("en-IN")}
          </h2>
        </div>

        <button
          onClick={handlePayment}
          style={{
            width: "100%",
            background:
              "linear-gradient(135deg,#22c55e,#16a34a)",
            color: "white",
            border: "none",
            padding: "16px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "700",
            marginTop: "20px",
          }}
        >
          Pay ₹{total.toLocaleString("en-IN")}
        </button>

        <button
          onClick={() => navigate("/shop")}
          style={{
            width: "100%",
            background: "#334155",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "12px",
            cursor: "pointer",
            marginTop: "12px",
          }}
        >
          Back To Shop
        </button>
      </div>
    </div>
  );
}

export default Checkout;