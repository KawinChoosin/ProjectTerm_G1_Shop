import React from 'react';
import './AdminPage.css'; // Add custom styles here

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="admin-dashboard">
          <nav className="sidebar">
              <div className="sidebar-header">
                  <h2>KAD-ENT</h2>
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
          <div className="card">
            <h3>Weekly Sales</h3>
            <p>$15,000</p>
            <p>Increased by 60%</p>
          </div>

          <div className="card">
            <h3>Weekly Orders</h3>
            <p>45,6334</p>
            <p>Decreased by 10%</p>
          </div>

          <div className="card">
            <h3>Visitors Online</h3>
            <p>95,5741</p>
            <p>Increased by 5%</p>
          </div>
        </div>

        <div className="stats-section">
          <h2>Visit And Sales Statistics</h2>
          {/* Add a chart component here if needed */}
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
