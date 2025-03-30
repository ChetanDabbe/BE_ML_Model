import React from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import LiveFeed from "./components/LiveFeed";
import "./App.css";
import RecentInspection from "./components/RecentInspection";
import DefectDistribution from "./components/DefectDistribution";

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        {/* Other sections like Stats Cards, Live Feed, etc. will go here */}

        <Dashboard />
        <div className="live-section-container">
          <LiveFeed />
          <div className="live-section-cont1">
          <RecentInspection />
          <DefectDistribution/>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}

export default App;
