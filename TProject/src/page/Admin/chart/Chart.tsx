import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import the date-fns adapter

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Interfaces for sales data
interface DailySales {
  date: string;
  totalSales: number;
}

interface DailyOrders {
  date: string;
  totalOrders: number;
}

interface MonthlySales {
  month: string;
  totalSales: number;
}

const Chart: React.FC = () => {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [dailyOrders, setDailyOrders] = useState<DailyOrders[]>([]);
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch total sales, orders, and monthly data from the backend
  useEffect(() => {
    const fetchWeeklyData = async () => {
      setLoading(true); // Start loading
      try {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday of the current week
        const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6)); // Sunday of the current week

        // Format dates for API calls
        const startOfWeekStr = startOfWeek.toISOString();
        const endOfWeekStr = endOfWeek.toISOString();

        // Fetch total sales for the current week
        const salesResponse = await fetch(`http://localhost:3000/sales/total-sales-week?start=${startOfWeekStr}&end=${endOfWeekStr}`);
        if (!salesResponse.ok) throw new Error(`Failed to fetch weekly sales: ${salesResponse.statusText}`);

        const salesData: DailySales[] = await salesResponse.json();
        setDailySales(salesData);
        const totalSalesAmount = salesData.reduce((sum, day) => sum + day.totalSales, 0);
        setTotalSales(totalSalesAmount);

        // Fetch total orders for the current week
        const ordersResponse = await fetch(`http://localhost:3000/sales/total-orders-week?start=${startOfWeekStr}&end=${endOfWeekStr}`);
        if (!ordersResponse.ok) throw new Error(`Failed to fetch weekly orders: ${ordersResponse.statusText}`);

        const ordersData: DailyOrders[] = await ordersResponse.json();
        setDailyOrders(ordersData);
        const totalOrdersCount = ordersData.reduce((sum, day) => sum + day.totalOrders, 0);
        setTotalOrders(totalOrdersCount);

        // Fetch monthly sales data
        const monthlySalesResponse = await fetch('http://localhost:3000/sales/total-sales-month');
        if (!monthlySalesResponse.ok) throw new Error(`Failed to fetch monthly sales: ${monthlySalesResponse.statusText}`);

        const monthlySalesData: MonthlySales[] = await monthlySalesResponse.json();
        setMonthlySales(monthlySalesData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchWeeklyData();
  }, []);

  // const fetchMonthlySalesData = async () => {
  //   try {
  //     const monthlySalesResponse = await fetch('http://localhost:3000/sales/total-sales-month');
  //     if (!monthlySalesResponse.ok) throw new Error(`Failed to fetch monthly sales: ${monthlySalesResponse.statusText}`);

  //     const monthlySalesData = await monthlySalesResponse.json();
  //     setMonthlySales(monthlySalesData);

  //     // Check the data format
  //     console.log(monthlySalesData); // Log the data for debugging
  //   } catch (error) {
  //     console.error('Error fetching monthly sales data:', error);
  //   }
  // };

  // fetchMonthlySalesData();

  // Prepare data for the bar chart with Mon to Sun labels
  const weeklyChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Weekly Sales ($)',
        data: dailySales.map(sales => sales.totalSales),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the line chart (12PM to 12AM)
  const dailyChartData = {
    labels: [
      '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM'
    ],
    datasets: [
      {
        label: 'Daily Sales ($)',
        data: dailySales.map((sales) => sales.totalSales),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
    ],
  };

  // // Prepare data for the monthly sales chart
  // const monthlyChartData = {
  //   labels: [
  //     'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  //   ],
  //   datasets: [
  //     {
  //       label: 'Monthly Sales ($)',
  //       data: monthlySales.map(sale => sale.totalSales), // Array of total sales amounts
  //       backgroundColor: 'rgba(153, 102, 255, 0.6)',
  //       borderColor: 'rgba(153, 102, 255, 1)',
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  return (
    <Box sx={{ padding: 2,minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Sales Analytics
      </Typography>

      {loading ? ( // Show loading spinner while fetching data
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Weekly Total Sales
                </Typography>
                <Typography variant="h4" color="primary">
                  ${totalSales.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Weekly Total Orders
                </Typography>
                <Typography variant="h4" color="secondary">
                  {totalOrders}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Box sx={{ mt: 4 }}>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Daily Sales Overview
              </Typography>
              <Line data={dailyChartData} options={{ responsive: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Weekly Sales Overview
              </Typography>
              <Bar data={weeklyChartData} options={{ responsive: true }} />
              {/* <Typography variant="h6" gutterBottom>
                Monthly Sales Overview
              </Typography>
              <Line data={monthlyChartData} options={{ responsive: true }} /> */}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Chart;
