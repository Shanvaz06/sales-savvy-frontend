import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        background: "#0f172a",
        padding: "18px 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #1e293b",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <h2
        style={{
          color: "white",
          margin: 0,
          fontSize: "28px",
          fontWeight: "700",
          letterSpacing: "1px",
        }}
      >
        Sales Savvy
      </h2>

      <div
        style={{
          display: "flex",
          gap: "30px",
          alignItems: "center",
        }}
      >
        <Link
          to="/shop"
          style={{
            color: "#e2e8f0",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Shop
        </Link>

        <Link
          to="/cart"
          style={{
            color: "#e2e8f0",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Cart
        </Link>

        <Link
          to="/orders"
          style={{
            color: "#e2e8f0",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Orders
        </Link>

        <Link
          to="/dashboard"
          style={{
            color: "#e2e8f0",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Dashboard
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("cart");
            window.location.href = "/";
          }}
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;