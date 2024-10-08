import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Typography,
  Card,
  Grid,
} from "@mui/material";

interface Category {
  CG_id: number;
  CG_name: string;
}

const AddProductPage: React.FC = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [fileImg, setFileImg] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null); // State to hold image preview URL

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Create a preview URL for the selected image
    if (fileImg) {
      const objectUrl = URL.createObjectURL(fileImg);
      setImgPreview(objectUrl);

      // Cleanup function to revoke the object URL when the component unmounts or the file changes
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImgPreview(null); // Reset preview if no image is selected
    }
  }, [fileImg]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("P_name", productName);
    formData.append("P_description", description);
    formData.append("P_price", price);
    formData.append("P_quantity", quantity);

    if (fileImg) {
      formData.append("P_img", fileImg);
    }

    // If a new category is being added, send it to the server.
    if (newCategory) {
      try {
        const categoryResponse = await axios.post(
          "http://localhost:3000/categories",
          {
            CG_name: newCategory,
          }
        );
        formData.append("CG_id", categoryResponse.data.CG_id); // assuming the server returns the new category ID
      } catch (error) {
        console.error("Error adding new category:", error);
        return; // Prevent product submission if category creation fails
      }
    } else {
      formData.append("CG_id", category);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Product added successfully");
        setProductName("");
        setDescription("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setFileImg(null);
        setNewCategory("");
        setImgPreview(null); // Reset the image preview
        setSuccessMessage(true);
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFileImg(selectedFile);
    }
  };

  const handleClose = () => {
    setSuccessMessage(false);
  };

  return (
    <Box sx={{ padding: 2, minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom color="black">
        Add Product
      </Typography>
      <Card
        elevation={3}
        sx={{ padding: 3, borderRadius: 2, margin: "0 auto" }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Product Name"
                  variant="outlined"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  multiline
                  rows={2}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Price"
                  type="number"
                  variant="outlined"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (e.target.value === "new") {
                      setNewCategory("");
                    }
                  }}
                  required
                >
                  <MenuItem value="">
                    <em>Select Category</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.CG_id} value={cat.CG_id}>
                      {cat.CG_name}
                    </MenuItem>
                  ))}
                  <MenuItem value="new">Add New Category</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Conditionally render input for new category if "Add New Category" is selected */}
            {category === "new" && (
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="New Category Name"
                    variant="outlined"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                  />
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Quantity"
                  type="number"
                  variant="outlined"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>

            {/* Framed area for file upload */}
            {/* Framed area for file upload */}
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <label htmlFor="imageUpload" style={{ cursor: "pointer" }}>
                  <Box
                    sx={{
                      border: "2px dashed #3f51b5",
                      borderRadius: "4px",
                      padding: 2,
                      textAlign: "center",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Typography variant="body1" color="#3f51b5">
                      {fileImg
                        ? fileImg.name
                        : "Drag and drop your image here or click to upload"}
                    </Typography>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      required
                      style={{ display: "none" }}
                    />
                  </Box>
                </label>
              </FormControl>
            </Grid>

            {/* Display the image preview if available */}
            {imgPreview && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "16px",
                  }}
                >
                  <img
                    src={imgPreview}
                    alt="Product Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Add Product
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>

      <Snackbar
        open={successMessage}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Set anchor position to top center
      >
        <Alert onClose={handleClose} severity="success">
          Product added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddProductPage;
