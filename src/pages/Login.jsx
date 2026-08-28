import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:9091/auth/login",
        {
          email,
          password,
        }
      );

      // backend returns token as plain string
      const token = response.data;

console.log("TOKEN =", token);

localStorage.setItem("token", token);

// Get role from JWT
const payload = JSON.parse(atob(token.split(".")[1]));
const role = payload.role;

console.log("ROLE =", role);

alert("Login Successful");

if (role === "ADMIN") {
  navigate("/dashboard");
} else {
  navigate("/shop");
}
    } catch (error) {
      console.error(error);
      alert("Invalid Credentials");
    }
  };

  return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "linear-gradient(135deg,#020617,#1e3a8a,#2563eb)",
      padding: "20px",
    }}
  >
    <form
  onSubmit={handleLogin}
  style={{
    background: "rgba(30,41,59,0.9)",
    padding: "40px",
    borderRadius: "20px",
    width: "420px",
    color: "white",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
  }}
>
      <div
  style={{
    textAlign: "center",
    marginBottom: "30px",
  }}
>
  <h1
    style={{
      margin: 0,
      fontSize: "42px",
      fontWeight: "800",
    }}
  >
    Sales Savvy
  </h1>

  <p
    style={{
      color: "#cbd5e1",
      marginTop: "10px",
    }}
  >
    Welcome Back
  </p>
</div>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "15px",
          marginBottom: "18px",
          borderRadius: "10px",
          border: "1px solid #475569",
          background: "#1e293b",
          color: "white",
          fontSize: "15px",
          boxSizing: "border-box",
        }}
      />

      <div style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #475569",
            background: "#1e293b",
            color: "white",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "15px",
            top: "14px",
            cursor: "pointer",
            color: "#cbd5e1",
          }}
        >
          {showPassword ? "Hide" : "Show"}
        </span>
      </div>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "15px",
          marginTop: "25px",
          background: "linear-gradient(135deg,#3b82f6,#2563eb)",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow:
"0 8px 20px rgba(37,99,235,0.4)",
        }}
      >
        Login
      </button>

      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#d1d5db",
        }}
      >
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{
            color: "#60a5fa",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Register
        </Link>
      </p>
    </form>
  </div>
);
}
export default Login;