import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');

  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: 'http://localhost:9090',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const loadProducts = async () => {
    try {
      const response = await api.get('/products/all');
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to load products');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    axios.get("http://localhost:9090/categories/all", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => {
        setCategories(response.data);
    })
    .catch(error => {
        console.error("Error fetching categories:", error);
    });
}, []);

  const clearForm = () => {
    setProductName('');
    setPrice('');
    setQuantity('');
    setCategoryId('');
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
        alert('Product updated successfully');
      } else {
        await api.post('/products/save', productData);
        alert('Product added successfully');
      }

      clearForm();
      loadProducts();
    } catch (error) {
      console.error(error);
      alert('Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setProductName(product.productName);
    setPrice(product.price);
    setQuantity(product.quantity);
    setCategoryId(product.category?.id || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await api.delete(`/products/delete/${id}`);
      alert('Product deleted successfully');
      loadProducts();
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#111827',
        color: 'white',
        padding: '30px',
      }}
    >
      <h1 style={{ marginBottom: '20px' }}>Products</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: '12px',
          marginBottom: '30px',
        }}
      >
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '6px', border: 'none' }}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '6px', border: 'none' }}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '6px', border: 'none' }}
        />

        <select
    value={categoryId}
    onChange={(e) => setCategoryId(e.target.value)}
>
    <option value="">Select Category</option>

    {categories.map((category) => (
        <option key={category.id} value={category.id}>
            {category.categoryName}
        </option>
    ))}
</select>

        <button
          type="submit"
          style={{
            background: editingId ? '#f59e0b' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px',
            cursor: 'pointer',
          }}
        >
          {editingId ? 'Update Product' : 'Add Product'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={clearForm}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#1f2937',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{ background: '#374151' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Quantity</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderTop: '1px solid #374151' }}>
                <td style={{ padding: '12px' }}>{product.id}</td>
                <td style={{ padding: '12px' }}>{product.productName}</td>
                <td style={{ padding: '12px' }}>₹{product.price}</td>
                <td style={{ padding: '12px' }}>{product.quantity}</td>
                <td style={{ padding: '12px' }}>
                  {product.category?.categoryName || product.category?.id || '-'}
                </td>
                <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      cursor: 'pointer',
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
  );
}

export default Products;

