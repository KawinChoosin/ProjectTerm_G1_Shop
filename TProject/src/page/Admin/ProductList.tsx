import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SelectChangeEvent,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Modal,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

interface Category {
  CG_id: number;
  CG_name: string;
}

interface Product {
  P_id: number;
  P_name: string;
  P_description: string;
  P_price: number;
  P_quantity: number;
  P_img: string;
  CG_id: number; // Category ID
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  // const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [showAlert, setShowAlert] = useState(false); //set time to show alert
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}/products`
        );
        const sortedProducts = response.data.sort(
          (a: Product, b: Product) => b.P_id - a.P_id
        );
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}/categories`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, products]);

  const triggerAlert = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);

    // set time out = 5 sec for alert
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const applyFilter = () => {
    let filtered = [...products];

    if (filter === "low-stock") {
      filtered = filtered.filter((product) => product.P_quantity <= 5);
    } else if (filter !== "all") {
      filtered = filtered.filter(
        (product) => product.CG_id === parseInt(filter)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setImagePreview(
      `${import.meta.env.VITE_APP_API_BASE_URL}/uploads/${product.P_img}`
    ); // Set image preview to existing image
    setImageFile(null); // Reset the uploaded file
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    setFormData((prev) => ({ ...prev, CG_id: event.target.value as number }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set preview image source
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editingProduct) {
      console.error("No product is being edited.");
      return; // Exit if editingProduct is null
    }

    // Prepare the form data to send to the server
    const formDataToSend = new FormData();
    formDataToSend.append("P_name", formData.P_name as string);
    formDataToSend.append("P_description", formData.P_description as string);
    formDataToSend.append("P_price", formData.P_price?.toString() as string);
    formDataToSend.append(
      "P_quantity",
      formData.P_quantity?.toString() as string
    );
    formDataToSend.append("CG_id", formData.CG_id?.toString() as string);

    // Append image file if it exists
    if (imageFile) {
      formDataToSend.append("P_img", imageFile);
    }

    try {
      // Send a PUT request to update the product
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_BASE_URL}/products/${
          editingProduct.P_id
        }`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
          },
        }
      );

      // Update the filtered products list with the updated product
      setFilteredProducts((prev) =>
        prev.map((product) =>
          product.P_id === editingProduct.P_id ? response.data : product
        )
      );

      // Clear the editing state and reset image preview
      setEditingProduct(null);
      setImagePreview(null);
      setImageFile(null);
      triggerAlert("Product updated successfully!", "success");
    } catch (error) {
      console.error("Error updating product:", error);
      triggerAlert("Failed to update product. Please try again.", "error");
    }
  };

  const handleClickOpenDeleteDialog = (id: number) => {
    setProductIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductIdToDelete(null);
  };

  const handleDelete = async () => {
    if (productIdToDelete !== null) {
      try {
        await axios.delete(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/products/${productIdToDelete}`
        );
        setFilteredProducts((prev) =>
          prev.filter((product) => product.P_id !== productIdToDelete)
        );
        triggerAlert("Product deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting product:", error);
        triggerAlert("Error deleting product. Please try again.", "error");
      }
      handleCloseDeleteDialog();
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Typography variant="h4" gutterBottom>
            Product List ({filteredProducts.length} items)
          </Typography>

          {/* Filter Buttons */}
          <Box sx={{ marginBottom: 2 }}>
            <Button
              onClick={() => handleFilterChange("all")}
              variant={filter === "all" ? "contained" : "outlined"}
              sx={{ marginRight: 1 }}
            >
              All
            </Button>
            <Button
              onClick={() => handleFilterChange("low-stock")}
              variant={filter === "low-stock" ? "contained" : "outlined"}
              sx={{ marginRight: 1 }}
            >
              Low Stock
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.CG_id}
                onClick={() => handleFilterChange(cat.CG_id.toString())}
                variant={
                  filter === cat.CG_id.toString() ? "contained" : "outlined"
                }
                sx={{ marginRight: 1 }}
              >
                {cat.CG_name}
              </Button>
            ))}
          </Box>

          {/* Check if there are no filtered products */}
          {filteredProducts.length === 0 ? (
            <Typography variant="h6">No products available.</Typography>
          ) : (
            <List>
              {filteredProducts.map((product) => (
                <ListItem key={product.P_id} divider>
                  <Avatar
                    src={`${import.meta.env.VITE_APP_API_BASE_URL}/uploads/${
                      product.P_img
                    }`}
                    alt={product.P_name}
                    sx={{ marginRight: 2 }}
                  />
                  <ListItemText
                    primary={
                      <Typography variant="h6">{product.P_name}</Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          <strong>Price:</strong> ฿{product.P_price}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Quantity:</strong> {product.P_quantity}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Description:</strong> {product.P_description}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Category:</strong>{" "}
                          {categories.find((cat) => cat.CG_id === product.CG_id)
                            ?.CG_name || "Unknown"}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(product)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleClickOpenDeleteDialog(product.P_id)}
                    >
                      Delete
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}

      {/* Modal for editing product */}
      <Modal open={!!editingProduct} onClose={() => setEditingProduct(null)}>
        <Box
          sx={{
            width: 600,
            bgcolor: "background.paper",
            padding: 4,
            margin: "auto",
            alignItems: "center",
            justifyItems: "center",
            borderRadius: 2,
            boxShadow: 3,
            maxHeight: "95%", // Set a max height for the modal
            overflowY: "auto", // Allow vertical scrolling
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Product
            <IconButton
              aria-label="close"
              onClick={() => setEditingProduct(null)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </Typography>

          <TextField
            label="Product Name"
            name="P_name"
            value={formData.P_name || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="P_description"
            value={formData.P_description || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            label="Price"
            name="P_price"
            type="number"
            value={formData.P_price || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            name="P_quantity"
            type="number"
            value={formData.P_quantity || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.CG_id || ""}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.CG_id} value={cat.CG_id}>
                  {cat.CG_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Image Upload */}
          <Box marginBottom={2}>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {imagePreview && (
              <Box sx={{ mt: 1 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%" }}
                />
              </Box>
            )}
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setEditingProduct(null)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for success message */}
      <Snackbar
        open={showAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alertSeverity} onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;
