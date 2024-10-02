import React, { useState } from 'react';
import './AddProduct.css'; // Custom styles for sidebar and form
import axios from 'axios';

const AddProductPage: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [fileImg, setFileImg] = useState<File | null>(null); // Properly typed File state

  const categoryMap = {
    Clothes: 1,    // Example: this would map to the corresponding ID in your database
    Sports: 2,
    Electronics: 3,
  };
  
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
  
    // Map the category name to the correct CG_id
    const selectedCategoryId = categoryMap[category];
    formData.append('CG_id', selectedCategoryId); // Append the correct category ID
  
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
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>KAD-ENT</h2>
        </div>
        <ul>
          <li><a href="/AdminPage">Dashboard</a></li>
          <li><a href="/addProduct">Add Product</a></li>
        </ul>
      </nav>

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
                <option value="Clothes">Clothes</option>
                <option value="Sports">Sports</option>
                <option value="Electronics">Electronics</option>
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
