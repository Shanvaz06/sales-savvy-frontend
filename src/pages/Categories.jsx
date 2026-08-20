import { useEffect, useState } from 'react';
import axios from 'axios';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');

  const loadCategories = () => {
    axios.get('http://localhost:9090/categories/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setCategories(res.data))
    .catch(err => console.error(err));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.post(
      'http://localhost:9090/categories/save',
      {
        categoryName: categoryName
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(response.data);

    alert('Category added successfully');

    setCategoryName('');
    loadCategories();

  } catch (error) {
    console.error(error);
    alert('Failed to add category');
  }
};

  const updateCategory = async () => {
    await axios.put(
      `http://localhost:9090/categories/update/${editingId}`,
      { categoryName },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setEditingId(null);
    setCategoryName('');
    loadCategories();
  };

  const deleteCategory = async (id) => {
    await axios.delete(
      `http://localhost:9090/categories/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    loadCategories();
  };

  return (
    <div style={{ padding: '30px', background: 'white', minHeight: '100vh', color: 'black' }}>
      <h1>Categories</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        />

        {editingId ? (
          <button onClick={updateCategory}>Update</button>
        ) : (
          <button onClick={addCategory}>Add Category</button>
        )}
      </div>

      <table border="1" cellPadding="10" style={{
        borderCollapse: 'collapse',
        width: '100%'
      }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.categoryName}</td>
              <td>
                <button
                  onClick={() => {
                    setEditingId(category.id);
                    setCategoryName(category.categoryName);
                  }}
                  style={{ marginRight: '8px' }}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteCategory(category.id)}
                  style={{ background: 'crimson', color: 'white' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;