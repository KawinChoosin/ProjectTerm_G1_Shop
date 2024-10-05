import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import 'chart.js/auto'; // Required for chart.js

const AdminDashboardPage = () => {
  // const [salesData, setSalesData] = useState([]);

  // useEffect(() => {
  //   // Fetch weekly sales data from API
  //   const fetchSalesData = async () => {
  //     try {
  //       const response = await fetch('/api/weekly-sales');
  //       const data = await response.json();
  //       setSalesData(data);
  //     } catch (error) {
  //       console.error('Error fetching sales data:', error);
  //     }
  //   };

  //   fetchSalesData();
  // }, []);

  // const chartData = {
  //   labels: salesData.map(sale => `Week ${sale.week}`), // Example week label
  //   datasets: [
  //     {
  //       label: 'Weekly Sales',
  //       data: salesData.map(sale => sale._sum.amount), // The sum of sales for each week
  //       fill: false,
  //       backgroundColor: 'rgba(75, 192, 192, 0.6)',
  //       borderColor: 'rgba(75, 192, 192, 1)',
  //     },
  //   ],
  // };

  // const options = {
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //     },
  //   },
  // };

  return (
    <div className="admin-dashboard">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2><a href="/">KAD-ENT</a></h2>
        </div>
        <ul>
          <li><a href="/AdminPage">Dashboard</a></li>
          <li><a href="/addProduct">Add Product</a></li>
        </ul>
      </nav>

      <div className="main-content">
        <header className="header">
          <h1>Welcome, admin</h1>
        </header>

        <div className="dashboard-cards">
          {/* Existing cards */}
        </div>

        <div className="stats-section">
          <h2>Weekly Sales Statistics</h2>
          
        </div>

        <div className="traffic-section">
          <h2>Traffic Sources</h2>
          {/* Add a pie chart or graph for traffic sources */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
