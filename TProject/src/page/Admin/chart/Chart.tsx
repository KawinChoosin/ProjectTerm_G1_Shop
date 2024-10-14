import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
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
} from "chart.js";
import "chartjs-adapter-date-fns"; // Import the date-fns adapter

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
  totalSum: number;
}

interface DailyOrders {
  date: string;
  totalOrders: number;
}

const Chart: React.FC = () => {
  const [totalSum, setTotalSales] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [dailyOrders, setDailyOrders] = useState<DailyOrders[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch total sales, orders, and monthly data from the backend
  useEffect(() => {
    const fetchWeeklyData = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const startOfWeek = new Date(
          now.setDate(now.getDate() - now.getDay() + 1)
        );
        const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));

        const startOfWeekStr = startOfWeek.toISOString();
        const endOfWeekStr = endOfWeek.toISOString();

        // Fetch total sales for the current week
        const salesResponse = await fetch(
          `api/order/chart/total-sales-week?start=${startOfWeekStr}&end=${endOfWeekStr}`
        );
        const salesData = await salesResponse.json();

        // Assume salesData is in the format you provided in your example
        const totalSalesAmount = salesData.orders.reduce(
          (acc: any, order: any) => acc + parseFloat(order.O_Total),
          0
        );
        const totalOrdersCount = salesData.orders.length;

        // Create an array to store daily sales and orders
        const dailySalesMap: { [key: string]: number } = {};
        const dailyOrdersMap: { [key: string]: number } = {};

        salesData.orders.forEach(
          (order: { O_Date_time: string | number | Date; O_Total: string }) => {
            const orderDate = new Date(order.O_Date_time)
              .toISOString()
              .split("T")[0]; // Get only the date part

            // Accumulate sales
            if (!dailySalesMap[orderDate]) {
              dailySalesMap[orderDate] = 0;
            }
            dailySalesMap[orderDate] += parseFloat(order.O_Total);

            // Accumulate order count
            if (!dailyOrdersMap[orderDate]) {
              dailyOrdersMap[orderDate] = 0;
            }
            dailyOrdersMap[orderDate] += 1;
          }
        );

        // Convert daily sales and orders maps to arrays
        const dailySales = Object.keys(dailySalesMap).map((date) => ({
          date,
          totalSum: dailySalesMap[date],
        }));
        const dailyOrders = Object.keys(dailyOrdersMap).map((date) => ({
          date,
          totalOrders: dailyOrdersMap[date],
        }));

        // Set state
        setDailySales(dailySales);
        setDailyOrders(dailyOrders);
        setTotalSales(totalSalesAmount);
        setTotalOrders(totalOrdersCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, []);

  // Prepare data for the bar chart with Mon to Sun labels
  const weeklyChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Weekly Sales ($)",
        data: [
          dailySales.find((sale) => new Date(sale.date).getDay() === 1)
            ?.totalSum || 0, // Monday
          dailySales.find((sale) => new Date(sale.date).getDay() === 2)
            ?.totalSum || 0, // Tuesday
          dailySales.find((sale) => new Date(sale.date).getDay() === 3)
            ?.totalSum || 0, // Wednesday
          dailySales.find((sale) => new Date(sale.date).getDay() === 4)
            ?.totalSum || 0, // Thursday
          dailySales.find((sale) => new Date(sale.date).getDay() === 5)
            ?.totalSum || 0, // Friday
          dailySales.find((sale) => new Date(sale.date).getDay() === 6)
            ?.totalSum || 0, // Saturday
          dailySales.find((sale) => new Date(sale.date).getDay() === 0)
            ?.totalSum || 0, // Sunday
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the line chart (12PM to 12AM)
  // Assuming you have a way to determine sales by hour, you might need to structure your daily sales data accordingly
  const hourlySalesData = Array(24).fill(0); // Initialize an array for 24 hours

  dailyOrders.forEach((order) => {
    const orderHour = new Date(order.date).getHours(); // Get the hour of the order
    const totalOrderAmount = order.totalOrders; // Adjust according to your data structure

    hourlySalesData[orderHour] += totalOrderAmount; // Accumulate sales for each hour
  });

  // Prepare the data for the line chart
  // const dailyChartData = {
  //   labels: [
  //     '12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM',
  //     '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'
  //   ],
  //   datasets: [
  //     {
  //       label: 'Daily Sales ($)',
  //       data: hourlySalesData, // Use the accumulated hourly sales data
  //       fill: false,
  //       borderColor: 'rgba(255, 99, 132, 1)',
  //       tension: 0.1,
  //     },
  //   ],
  // };

  return (
    <Box sx={{ padding: 2, minHeight: "100vh" }}>
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
                  ${totalSum}
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
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Daily Sales Overview
            </Typography>
            <Line data={dailyChartData} options={{ responsive: true }} />
          </Grid> */}
          <Grid item xs={12} md={10}>
            <Typography variant="h5" gutterBottom>
              Weekly Sales Overview
            </Typography>
            <Bar data={weeklyChartData} options={{ responsive: true }} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Chart;
