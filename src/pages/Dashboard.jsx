import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    categories: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      if (!token || token === "undefined") {
        alert("Please login first");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:9091/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(response.data);
      } catch (error) {
        console.error(error);
        alert("Unauthorized. Login again");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "50px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "10px",
          }}
        >
          Sales Savvy Admin
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "18px",
          }}
        >
          Manage Products, Categories and Users
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "25px",
          marginBottom: "50px",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg,#2563eb,#1d4ed8)",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 10px 25px rgba(37,99,235,0.4)",
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              fontSize: "22px",
            }}
          >
            👥 Users
          </h3>

          <h1>{stats.users}</h1>
        </div>

        <div
          style={{
            background:
              "linear-gradient(135deg,#22c55e,#16a34a)",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 10px 25px rgba(34,197,94,0.4)",
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              fontSize: "22px",
            }}
          >
            📦 Products
          </h3>

          <h1>{stats.products}</h1>
        </div>

        <div
          style={{
            background:
              "linear-gradient(135deg,#f59e0b,#d97706)",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 10px 25px rgba(245,158,11,0.4)",
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              fontSize: "22px",
            }}
          >
            🏷 Categories
          </h3>

          <h1>{stats.categories}</h1>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "20px",
          border: "1px solid #334155",
        }}
      >
        <h2
          style={{
            marginBottom: "25px",
          }}
        >
          Quick Actions
        </h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/products")}
            style={{
              background:
                "linear-gradient(135deg,#3b82f6,#2563eb)",
              color: "white",
              border: "none",
              padding: "15px 25px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            📦 Manage Products
          </button>

          <button
            onClick={handleLogout}
            style={{
              background:
                "linear-gradient(135deg,#ef4444,#dc2626)",
              color: "white",
              border: "none",
              padding: "15px 25px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;