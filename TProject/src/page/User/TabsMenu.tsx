import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Navbar from '../../components/Navbar';
import User from './User';
import { useContext, useEffect } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';
import { Container } from "@mui/material";
import useScreenSize from "../../components/useScreenSize"; // If you have a custom hook for screen size
import OrderList  from "./OrderList"

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
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 3, width: '100%' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function TabsMenu() {
  const [value, setValue] = React.useState(0);

  // Use hooks inside the functional component
  const navigate = useNavigate();
  const { C_id } = useContext(UserContext);
  const screenSize = useScreenSize();
  const isMobile = screenSize.width < 900;

  useEffect(() => {
    if (C_id === null) {
      navigate('/login');
    }
  }, [C_id, navigate]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: isMobile ? 0 : 20, mb: 8 }}> {/* Apply your container styles here */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
           
            ml: { lg: "300px"},
            flexDirection: { xs: 'column', sm: 'row' }, // Stack for smaller screens
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
              borderColor: 'divider',
              width: { xs: '100%', sm: 200 }, // Full width on small screens
              mb: { xs: 2, sm: 0 }, // Add margin on small screens
            }}
          >
            <Tab label="Profile" {...a11yProps(0)} />
            <Tab label="Order" {...a11yProps(1)} />
          </Tabs>
          <Box sx={{ flexGrow: 1, width: '100%' }}> {/* Ensure content takes up remaining space */}
            <TabPanel value={value} index={0}>
              <User />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <OrderList />
            </TabPanel>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default TabsMenu;
