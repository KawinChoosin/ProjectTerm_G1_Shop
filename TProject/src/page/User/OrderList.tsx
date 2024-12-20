import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserContext from "../../context/UserContext";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Collapse,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  FormControl as MuiFormControl,
  Dialog,
  DialogContentText,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Grid2"; // Importing Grid2
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Loadingcompo from "../../components/loading";
import Chip from "@mui/material/Chip";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Pagination from "@mui/material/Pagination";

const OrderList: React.FC = () => {
  const { C_id } = useContext<any>(UserContext); // Get C_id from context
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openOrder, setOpenOrder] = useState<number | null>(null); // State to track which order is open
  const [orderDescriptions, setOrderDescriptions] = useState<{
    [key: number]: string | null;
  }>({});
  const [descripupdate, setdescripupdate] = useState<boolean>(false);
  const [orderdelete, setOrderDeleting] = useState<boolean>(false);
  const [admin, setAdmin] = useState<boolean>(false);
  const [orderStatuses, setOrderStatuses] = useState<{
    [key: number]: "waiting" | "Delivery on the way" | "Problem";
  }>({});
  const [customers, setCustomers] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page number
  // Define the number of orders to display per page
  const ordersPerPage = 5;
  const [nowlogin, setNowlogin] = useState<string>("C_id");
  // Get the current index range for the displayed orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // Track selected status
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [showAlert, setShowAlert] = useState(false); //set time to show alert
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState<number | null>(null); // Track the order to delete

  const handleOpenDialog = (O_id: number) => {
    setOrderIdToDelete(O_id); // Store the order ID for deletion
    setOpenConfirmDialog(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false); // Close the dialog
    setOrderIdToDelete(null); // Reset the selected order ID
  };

  const handleConfirmDelete = async () => {
    if (orderIdToDelete !== null) {
      await handleOrderDelete(orderIdToDelete); // Call the delete function with the correct order ID
    }
    handleCloseDialog(); // Close the dialog after deleting
  };

  // Filter and slice orders based on pagination
  const filteredOrders = orders
    .filter((order) =>
      selectedCustomer ? order.Customer?.C_name === selectedCustomer : true
    ) // Filter by customer
    .filter((order) => {
      const currentStatus =
        orderStatuses[order.O_id] ||
        (order.O_status === "SUCCESS"
          ? "Delivery on the way"
          : order.O_status === "ERROR"
          ? "Problem"
          : "waiting");
      return selectedStatus ? currentStatus === selectedStatus : true; // Filter by selected status
    });

  const displayedOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  ); // Show orders based on pagination

  useEffect(() => {
    const fetchOrders = async () => {
      if (C_id) {
        try {
          setNowlogin(C_id);
          const role = await axios.get(
            `api/profile?C_id=${C_id}`
          );
          if (role.data[0].C_Role) {
            setAdmin(true);
            const response = await axios.get(
              `api/orderlist/customer`
            );
            setOrders(response.data);
          } else {
            const response = await axios.get(
              `api/order/customer/${C_id}`
            );
            setOrders(response.data);
          }
        } catch (err) {
          // console.log(err);
          setError("You don't have any orders.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("No customer ID found.");
      }
    };
    if (nowlogin !== C_id) {
      fetchOrders();
    }
  }, [C_id, descripupdate, orders, orderdelete]);

  // Extract unique customer names from orders
  useEffect(() => {
    if (orders.length > 0) {
      const uniqueCustomers = Array.from(
        new Set(
          orders.map((order) => order.Customer?.C_name || "Unknown Customer")
        )
      );
      setCustomers(uniqueCustomers);
    }
  }, [orders]);

  if (loading) {
    return <Loadingcompo />;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const handleToggle = (orderId: number) => {
    setOpenOrder(openOrder === orderId ? null : orderId); // Toggle the open order
  };

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

  const handleDescriptionChange = (O_id: number, value: string) => {
    setOrderDescriptions((prevState) => ({
      ...prevState,
      [O_id]: value === "" ? null : value, // If the value is empty, set to null, else use the value
    }));
  };

  const handleDescriptionSubmit = async (O_id: number) => {
    try {
      setdescripupdate(true);

      // Map the frontend status to the backend enum values
      const statusMapping = {
        waiting: "DEFAULT",
        "Delivery on the way": "SUCCESS",
        Problem: "ERROR",
      };

      // Get the user-selected status and map it to the backend value
      const userStatus = orderStatuses[O_id] || "waiting"; // Default to 'waiting'
      const statusToUpdate = statusMapping[userStatus]; // Convert to backend status

      await axios.put(
        `api/orderlist/descrip`,
        {
          O_id,
          O_Description: orderDescriptions[O_id] || null, // Send the specific description for the order
          O_status: statusToUpdate, // Send the mapped status
        }
      );

      triggerAlert("Description updated successfully", "success");
      setdescripupdate(false);
    } catch (err) {
      triggerAlert("Error updating description", "error");
    }
  };

  const handleOrderDelete = async (O_id: number) => {
    try {
      // Show loading or set a state that indicates the deletion process
      setOrderDeleting(true);

      // Make a DELETE request to the backend to delete the order
      await axios.delete(
        `api/order/${O_id}`
      );

      // Trigger success message
      triggerAlert(
        "Order deleted successfully. Product quantities have been updated.",
        "success"
      );

      // Update any necessary frontend state (e.g., remove the deleted order from the UI)
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.O_id !== O_id)
      );

      // Optionally, reset any states related to the deletion
      setOrderDeleting(false);
    } catch (err) {
      // Trigger error message
      triggerAlert("Error deleting order", "error");

      // Optionally, handle any error states (e.g., stop loading spinner)
      setOrderDeleting(false);
    }
  };

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    orderId: number
  ) => {
    const value = event.target.value;

    // Set the status for the specific order directly as a string (waiting, Delivery on the way, Problem)
    setOrderStatuses((prevState) => ({
      ...prevState,
      [orderId]: value as "waiting" | "Delivery on the way" | "Problem",
    }));
  };

  const handleCustomerChange = (event: SelectChangeEvent) => {
    setSelectedCustomer(event.target.value as string);
    setCurrentPage(1); // Reset to first page when changing customers
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "Problem":
        return "error"; // Red color for Problem
      case "Delivery on the way":
        return "success"; // Green color for delivery
      case "waiting":
      default:
        return "info"; // Grey color for waiting (default)
    }
  };

  // console.log(orders);

  return (
    <Grid container spacing={3}>
      {/* Customer Selection Dropdown */}
      {customers.length > 0 && admin && (
        <>
          <Snackbar
            open={showAlert}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity={alertSeverity} onClose={() => setShowAlert(false)}>
              {alertMessage}
            </Alert>
          </Snackbar>
          <Grid size={{ xs: 8, sm: 6, md: 6 }}>
            <Typography
              variant="body1"
              sx={{ fontFamily: "Montserrat", mb: 1 }}
            >
              Select Customers
            </Typography>
            <MuiFormControl fullWidth>
              <Select
                value={selectedCustomer}
                onChange={handleCustomerChange}
                sx={{ width: "100%" }}
                displayEmpty
                onFocus={() => setSelectedCustomer(selectedCustomer || "")} // To handle focus
              >
                <MenuItem value="">
                  <em>All Customers</em>
                </MenuItem>
                {customers.map((customer, index) => (
                  <MenuItem key={index} value={customer}>
                    {customer}
                  </MenuItem>
                ))}
              </Select>
            </MuiFormControl>
          </Grid>
          <Grid size={{ xs: 4, sm: 3.7, md: 3.7 }}>
            <Typography
              variant="body1"
              sx={{ fontFamily: "Montserrat", mb: 1 }}
            >
              Order Status
            </Typography>
            <MuiFormControl fullWidth>
              <FormControl fullWidth>
                <Select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  displayEmpty
                  sx={{ width: "100%" }}
                  onFocus={() => setSelectedStatus(selectedStatus || "")}
                >
                  <MenuItem value="">
                    <em>All Statuses</em>
                  </MenuItem>
                  <MenuItem value="waiting">Waiting</MenuItem>
                  <MenuItem value="Delivery on the way">
                    Delivery on the way
                  </MenuItem>
                  <MenuItem value="Problem">Problem</MenuItem>
                </Select>
              </FormControl>
            </MuiFormControl>
          </Grid>
        </>
      )}

      {customers.length > 0 && !admin && (
        <Grid size={9.8}>
          <Typography variant="body1" sx={{ fontFamily: "Montserrat", mb: 1 }}>
            Order Status
          </Typography>
          <MuiFormControl fullWidth>
            <FormControl fullWidth>
              <Select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                displayEmpty
                sx={{ width: "100%" }}
                onFocus={() => setSelectedStatus(selectedStatus || "")}
              >
                <MenuItem value="">
                  <em>All Statuses</em>
                </MenuItem>
                <MenuItem value="waiting">Waiting</MenuItem>
                <MenuItem value="Delivery on the way">
                  Delivery on the way
                </MenuItem>
                <MenuItem value="Problem">Problem</MenuItem>
              </Select>
            </FormControl>
          </MuiFormControl>
        </Grid>
      )}
      {displayedOrders.length === 0 ? (
        <Grid size={12}>
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              width: "80%",
              mt: 8,
              color: "GrayText",
              fontFamily: "Montserrat",
            }}
          >
            No orders found.
          </Typography>
        </Grid>
      ) : (
        displayedOrders.map((order, index) => (
          <Grid key={order.O_id} sx={{ width: { lg: "80%", sm: "80%" } }}>
            <Card
              variant="elevation"
              sx={{
                marginBottom: 1,
                border: "4px ",
                borderColor: order.O_status ? "success" : "error",
                boxShadow: order.O_status
                  ? "0 0 2px rgba(76, 175, 80)" // Green glow for success
                  : "0 0 2px rgba(244, 67, 54)", // Red glow for error
                transition: "box-shadow 0.3s ease",
              }}
            >
              <Grid
                container
                sx={{
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyItems: "flex-start",
                  cursor: "pointer",
                }}
                onClick={() => handleToggle(order.O_id)}
              >
                {/* Order Info */}
                <Grid size={6}>
                  {admin && (
                    <Typography variant="h6" sx={{ fontFamily: "Montserrat" }}>
                      Order ID: {order.O_id}
                    </Typography>
                  )}
                  {!admin && (
                    <Typography variant="h6" sx={{ fontFamily: "Montserrat" }}>
                      Order Number: {index + 1}{" "}
                      {/* Display the index + 1 for 1-based numbering */}
                    </Typography>
                  )}
                </Grid>
                <Grid size={6}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Chip
                      label={
                        orderStatuses[order.O_id] // Use updated status if available
                          ? orderStatuses[order.O_id] === "Delivery on the way"
                            ? "Delivery on the way"
                            : orderStatuses[order.O_id] === "Problem"
                            ? "Problem"
                            : "Waiting"
                          : order.O_status === "SUCCESS"
                          ? "Delivery on the way"
                          : order.O_status === "ERROR"
                          ? "Problem"
                          : "Waiting"
                      }
                      color={
                        orderStatuses[order.O_id] // Use updated status color if available
                          ? getOrderStatusColor(orderStatuses[order.O_id])
                          : getOrderStatusColor(
                              order.O_status === "SUCCESS"
                                ? "Delivery on the way"
                                : order.O_status === "ERROR"
                                ? "Problem"
                                : "waiting"
                            )
                      }
                      sx={{ fontFamily: "Montserrat" }}
                    />
                  </Box>
                </Grid>

                {/* Additional Order Details */}
                <Grid size={6}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "Montserrat" }}
                    >
                      Date: {new Date(order.O_Date_time).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "Montserrat" }}
                    >
                      Address: {order.Address.A_name} {order.Address.A_street},{" "}
                      {order.Address.A_city}, {order.Address.A_state}{" "}
                      {order.Address.A_postalCode}, {order.Address.A_country}{" "}
                      {order.Address.A_phone}
                    </Typography>
                  </Box>
                  {order.Payment.PM_path && (
                    <Typography
                      variant="body2"
                      component="a"
                      href={order.Payment.PM_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "primary",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontFamily: "Montserrat",
                      }}
                    >
                      Payment Slip
                    </Typography>
                  )}
                  {order.O_Description !== null && (
                    <Box
                      component="section"
                      sx={{
                        backgroundColor: "#F5F5F7", // Light yellow background for highlighting
                        padding: "10px", // Add some padding for better spacing
                        mt: 2,
                        borderRadius: "4px", // Optional: round the corners slightly
                        maxWidth: "100%", // Ensure box can expand to full width of parent
                        wordBreak: "break-word", // Break long words if necessary
                        whiteSpace: "pre-line", // Preserve line breaks in the text
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "Montserrat",
                        }}
                      >
                        {order.O_Description || "No description available"}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid size={6}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography
                      variant="h6"
                      fontWeight="500"
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        fontFamily: "Montserrat",
                      }}
                    >
                      ฿ {parseFloat(order.O_Total)}
                    </Typography>
                    {openOrder === order.O_id ? (
                      <IconButton
                        aria-label="collapse"
                        onClick={() => setOpenOrder(null)}
                      >
                        <ExpandLessIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        aria-label="expand"
                        onClick={() => setOpenOrder(order.O_id)}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Collapse
                in={openOrder === order.O_id}
                timeout="auto"
                unmountOnExit
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: "Montserrat", mb: 1 }}
                  >
                    Order Details:
                  </Typography>

                  {admin && (
                    <Grid size={{ xs: 12, md: 12 }}>
                      {/* TextField for Description */}
                      <TextField
                        id="description"
                        fullWidth
                        value={orderDescriptions[order.O_id] || ""}
                        label="Update Order Description"
                        placeholder="Enter order description"
                        multiline
                        minRows={4}
                        sx={{ mb: 2 }}
                        onChange={(e) =>
                          handleDescriptionChange(order.O_id, e.target.value)
                        }
                      />

                      {/* Order Status */}
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Order Status</FormLabel>
                        <RadioGroup
                          value={
                            orderStatuses[order.O_id] // Use updated status if available
                              ? orderStatuses[order.O_id]
                              : order.O_status === "SUCCESS"
                              ? "Delivery on the way"
                              : order.O_status === "ERROR"
                              ? "Problem"
                              : "waiting"
                          } // Default to 'waiting' if backend status is not provided
                          onChange={(e) => handleStatusChange(e, order.O_id)}
                        >
                          <FormControlLabel
                            value="waiting"
                            control={<Radio />}
                            label="Waiting"
                          />
                          <FormControlLabel
                            value="Delivery on the way"
                            control={<Radio />}
                            label="Delivery on the way"
                          />
                          <FormControlLabel
                            value="Problem"
                            control={<Radio />}
                            label="Problem"
                          />
                        </RadioGroup>
                      </FormControl>

                      {/* Submit Button */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDescriptionSubmit(order.O_id)}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleOpenDialog(order.O_id)}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Delete this order
                      </Button>
                      <Dialog
                        open={openConfirmDialog}
                        onClose={handleCloseDialog}
                      >
                        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete this order? This
                            action cannot be undone, and the product quantities
                            will be updated.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                          </Button>
                          <Button
                            onClick={handleConfirmDelete}
                            color="error"
                            autoFocus
                          >
                            Confirm Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Grid>
                  )}
                </CardContent>
              </Collapse>
              <Collapse
                in={openOrder === order.O_id}
                timeout="auto"
                unmountOnExit
              >
                <CardContent sx={{ padding: 0 }}>
                  {order.OrderDetail && order.OrderDetail.length > 0 ? (
                    order.OrderDetail.map((detail: any) => (
                      <Box
                        key={detail.OD_id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderColor="#e0e0e0"
                        sx={{
                          width: "100%",
                          padding: 2,
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          width="100%"
                          sx={{ padding: "10px" }}
                        >
                          <Grid size={4}>
                            <img
                              src={
                                `api/uploads/${detail.Product.P_img}` ||
                                "/placeholder.png"
                              }
                              alt={`${detail.Product.P_name} image`}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          </Grid>
                          <Grid size={6}>
                            <Typography
                              variant="h6"
                              fontWeight="500"
                              sx={{ fontFamily: "Montserrat" }}
                            >
                              {detail.OD_product_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ fontFamily: "Montserrat" }}
                            >
                              {detail.Product.P_description}
                            </Typography>
                            <Typography
                              className="price"
                              fontWeight="500"
                              sx={{ fontFamily: "Montserrat" }}
                            >
                              ฿{detail.Product.P_price} x {detail.OD_quantity}
                            </Typography>
                          </Grid>
                          <Grid size={4}>
                            <Typography
                              variant="h6"
                              fontWeight="500"
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                fontFamily: "Montserrat",
                              }}
                            >
                              ฿ {parseFloat(detail.OD_price).toFixed(2)}
                            </Typography>
                          </Grid>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="h5"
                      sx={{
                        display: "flex",
                        textAlign: "center",
                        justifyContent: "center",
                        width: "80%",
                        mt: 8,
                        color: "GrayText",
                        fontFamily: "Montserrat",
                      }}
                    >
                      No products found for this order.
                    </Typography>
                  )}
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))
      )}

      {/* Show More Button  */}
      {/* Show More Button with Pagination */}
      {filteredOrders.length > ordersPerPage && (
        <Grid size={12}>
          <Pagination
            count={Math.ceil(filteredOrders.length / ordersPerPage)} // Calculate the total number of pages
            page={currentPage}
            onChange={(_event, value) => {
              setCurrentPage(value); // Update current page on change
            }}
            color="primary"
          />
        </Grid>
      )}
    </Grid>
  );
};

export default OrderList;
