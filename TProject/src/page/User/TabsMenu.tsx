import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Navbar from "../../components/Navbar";
import User from "./User";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import useScreenSize from "../../components/useScreenSize"; // If you have a custom hook for screen size
import OrderList from "./OrderList";
import Addproduct from "../Admin/AddProduct";
import axios from "axios";
import SalesChart from "../Admin/chart/Chart";
import ProductList from "../Admin/ProductList";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && (
        <Box sx={{ p: 3, width: "100%" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function TabsMenu() {
  const [value, setValue] = React.useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<boolean>(false); // Admin state
  const { C_id } = useContext(UserContext);
  const screenSize = useScreenSize();
  const isMobile = screenSize.width < 900;

  // console.log(C_id);
  useEffect(() => {
    if (C_id !== null) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `api/profile?C_id=${C_id}`
          );
          setAdmin(response.data[0].C_Role);
        } catch (err) {
          setError("Error fetching user data.");
        }
      };
      fetchUser();
    } else {
      navigate("/login");
    }
  }, [C_id, navigate]);

  if (error) {
    return (
      <Typography
        variant="h4"
        color="error"
        sx={{ fontFamily: "Montserrat", padding: 10 }}
      >
        {error}
      </Typography>
    );
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: isMobile ? 0 : 20, mb: 8 }}>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            ml: { lg: "300px" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{
              borderRight: 1,
              borderColor: "divider",
              width: { xs: "100%", sm: 200 },
              mb: { xs: 2, sm: 0 },
            }}
          >
            {/* Show tabs conditionally based on admin status */}
            <Tab label="Profile" {...a11yProps(0)} />
            <Tab label="Order" {...a11yProps(1)} />
            {admin && <Tab label="Add Products" {...a11yProps(2)} />}
            {admin && <Tab label="Product List" {...a11yProps(3)} />}
            {admin && <Tab label="Sales Analytics" {...a11yProps(4)} />}

            {/* Only show Add Products if admin */}
          </Tabs>

          <Box sx={{ flexGrow: 1, width: "100%" }}>
            <TabPanel value={value} index={0}>
              <User />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <OrderList />
            </TabPanel>
            {admin && (
              <>
                <TabPanel value={value} index={2}>
                  <Addproduct />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <ProductList />{" "}
                  {/* Ensure ProductList is correctly imported */}
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <SalesChart />
                </TabPanel>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default TabsMenu;
