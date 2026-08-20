import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

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

      console.log("Dashboard token =", token);

      if (!token || token === "undefined") {
        alert("Please login first");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:9090/dashboard/stats",
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
        background: "#111827",
        color: "white",
        padding: "40px",
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>Sales Savvy Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "#1f2937",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
            textAlign: "center",
          }}
        >
          <h3>Users</h3>
          <h2>{stats.users}</h2>
        </div>

        <div
          style={{
            background: "#1f2937",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
            textAlign: "center",
          }}
        >
          <h3>Products</h3>
          <h2>{stats.products}</h2>
        </div>

        <div
          style={{
            background: "#1f2937",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
            textAlign: "center",
          }}
        >
          <h3>Categories</h3>
          <h2>{stats.categories}</h2>
        </div>
      </div>

      <button
  onClick={() => navigate('/products')}
  style={{
    marginTop: '10px',
    padding: '8px 12px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  }}
>
  Manage Products
</button>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          background: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;