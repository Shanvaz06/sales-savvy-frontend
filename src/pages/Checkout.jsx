import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Calculate total amount from cart
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

      // Create Razorpay order with actual cart total
      const response = await axios.post(
        "http://localhost:9090/payment/create-order",
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

      console.log("PAYMENT RESPONSE =", payment);
      console.log("TOTAL AMOUNT =", total);

      const options = {
        key: "rzp_test_TOoWRSL7X7maK7",

        amount: payment.amount * 100,

        currency: "INR",

        name: "Sales Savvy",

        description: "Purchase from Sales Savvy",

        order_id: payment.razorpayOrderId,

        handler: async function () {

  try {

    // 1. Mark payment successful
    await axios.put(
      `http://localhost:9090/payment/success/${payment.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 2. Prepare order items
    const orderItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.cartQuantity,
    }));

    console.log("ORDER ITEMS =", orderItems);

    // 3. Create order
    const orderResponse = await axios.post(
      "http://localhost:9090/orders/place",
      orderItems,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("ORDER CREATED =", orderResponse.data);

    // 4. Clear cart
    localStorage.removeItem("cart");

    alert("Payment Successful. Order Placed!");

    // 5. Go back to shop
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
          color: "#3399cc",
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

  // Empty cart
  if (cart.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#111827",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>Your cart is empty</h2>

        <button
          onClick={() => navigate("/shop")}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 25px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Go to Shop
        </button>
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
          maxWidth: "700px",
          margin: "auto",
        }}
      >
        <h1>Checkout</h1>

        {/* Cart Items */}
        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#1f2937",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <h2>{item.productName}</h2>

            <p>
              Price: ₹{Number(item.price).toLocaleString("en-IN")}
            </p>

            <p>
              Quantity: {item.cartQuantity}
            </p>

            <p>
              Subtotal: ₹
              {(
                Number(item.price) * Number(item.cartQuantity)
              ).toLocaleString("en-IN")}
            </p>
          </div>
        ))}

        {/* Total */}
        <div
          style={{
            background: "#374151",
            padding: "20px",
            borderRadius: "8px",
            marginTop: "25px",
          }}
        >
          <h2>
            Total: ₹{total.toLocaleString("en-IN")}
          </h2>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          style={{
            width: "100%",
            background: "#16a34a",
            color: "white",
            border: "none",
            padding: "15px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "18px",
            marginTop: "20px",
          }}
        >
          Pay ₹{total.toLocaleString("en-IN")}
        </button>

        <button
          onClick={() => navigate("/shop")}
          style={{
            width: "100%",
            background: "#374151",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "6px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Back to Shop
        </button>
      </div>
    </div>
  );
}

export default Checkout;