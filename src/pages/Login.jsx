import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:9090/auth/login",
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#111827",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "#1f2937",
          padding: "30px",
          borderRadius: "10px",
          width: "300px",
          color: "white",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "none",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "none",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;