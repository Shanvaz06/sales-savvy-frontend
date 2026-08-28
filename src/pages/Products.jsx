import React, { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:9091",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const loadProducts = async () => {
    try {
      const response = await api.get("/products/all");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:9091/categories/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const clearForm = () => {
    setProductName("");
    setPrice("");
    setQuantity("");
    setCategoryId("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      productName,
      price: Number(price),
      quantity: Number(quantity),
      category: {
        id: Number(categoryId),
      },
    };

    try {
      if (editingId) {
        await api.put(`/products/update/${editingId}`, productData);
        alert("Product Updated Successfully");
      } else {
        await api.post("/products/save", productData);
        alert("Product Added Successfully");
      }

      clearForm();
      loadProducts();
    } catch (error) {
      console.error(error);
      alert("Operation Failed");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setProductName(product.productName);
    setPrice(product.price);
    setQuantity(product.quantity);
    setCategoryId(product.category?.id || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/delete/${id}`);
      alert("Product Deleted Successfully");
      loadProducts();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
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
      <div
        style={{
          maxWidth: "1400px",
          margin: "auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          Product Management
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: "40px",
          }}
        >
          Total Products : {products.length}
        </p>

        <div
          style={{
            background: "#1e293b",
            padding: "30px",
            borderRadius: "18px",
            marginBottom: "35px",
            border: "1px solid #334155",
          }}
        >
          <h2
            style={{
              marginBottom: "25px",
            }}
          >
            {editingId ? "Update Product" : "Add New Product"}
          </h2>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",
              gap: "15px",
            }}
          >
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) =>
                setProductName(e.target.value)
              }
              required
              style={{
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                background: "#334155",
                color: "white",
              }}
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              required
              style={{
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                background: "#334155",
                color: "white",
              }}
            />

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              required
              style={{
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                background: "#334155",
                color: "white",
              }}
            />

            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value)
              }
              required
              style={{
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                background: "#334155",
                color: "white",
              }}
            >
              <option value="">
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.categoryName}
                </option>
              ))}
            </select>

            <button
              type="submit"
              style={{
                background: editingId
                  ? "#f59e0b"
                  : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "14px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={clearForm}
                style={{
                  background: "#64748b",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "14px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div
          style={{
            background: "#1e293b",
            borderRadius: "18px",
            overflow: "hidden",
            border: "1px solid #334155",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#334155",
                }}
              >
                <th style={{ padding: "18px" }}>ID</th>
                <th style={{ padding: "18px" }}>Product</th>
                <th style={{ padding: "18px" }}>Price</th>
                <th style={{ padding: "18px" }}>Stock</th>
                <th style={{ padding: "18px" }}>Category</th>
                <th style={{ padding: "18px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  style={{
                    borderTop:
                      "1px solid #334155",
                  }}
                >
                  <td style={{ padding: "16px" }}>
                    {product.id}
                  </td>

                  <td style={{ padding: "16px" }}>
                    {product.productName}
                  </td>

                  <td style={{ padding: "16px" }}>
                    ₹{product.price}
                  </td>

                  <td style={{ padding: "16px" }}>
                    {product.quantity}
                  </td>

                  <td style={{ padding: "16px" }}>
                    {product.category
                      ?.categoryName || "-"}
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleEdit(product)
                      }
                      style={{
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(product.id)
                      }
                      style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Products;