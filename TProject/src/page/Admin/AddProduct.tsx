import React, { useState, useEffect } from 'react';
import './AddProduct.css'; // Custom styles for sidebar and form
import axios from 'axios';

interface Category {
  CG_id: number;
  CG_name: string;
}

const AddProductPage: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]); // Dynamic categories
  const [successMessage, setSuccessMessage] = useState(false);
  const [fileImg, setFileImg] = useState<File | null>(null);

  useEffect(() => {
    // Fetch categories from your backend API
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categories');
        setCategories(response.data); // Assuming the data is an array of categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('P_name', productName);
    formData.append('P_description', description);
    formData.append('P_price', price);
    formData.append('P_quantity', quantity);

    if (fileImg) {
      formData.append('P_img', fileImg); // Append image file
    }

    formData.append('CG_id', category); // Use selected category ID

    try {
      const response = await axios.post('http://localhost:3000/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Product added successfully');
        setProductName('');
        setDescription('');
        setPrice('');
        setQuantity('');
        setCategory('');
        setFileImg(null);
        setSuccessMessage(true); // Show success message
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFileImg(selectedFile); // Set the image file
    }
  };

  return (
    <div className="add-product-page-container">
      {/* <nav className="sidebar">
        <div className="sidebar-header">
          <h2>KAD-ENT</h2>
        </div>
        <ul>
          <li><a href="/AdminPage">Dashboard</a></li>
          <li><a href="/addProduct">Add Product</a></li>
        </ul>
      </nav> */}

      <div className="add-product-content">
        <h1>Add New Product</h1>
        <div className="cardProduct">
          {successMessage && (
            <div className="success-popup">
              Product added successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.CG_id} value={cat.CG_id}>
                    {cat.CG_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUpload">Product Image</label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
