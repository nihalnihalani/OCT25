// src/components/Dashboard/Dashboard.js - Fresh Start
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firestore = useFirestore();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Reset and load fresh data
  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        // Clear old data
        localStorage.removeItem('financialProfile');
        localStorage.removeItem('quickFinancialProfile');
        localStorage.removeItem('purchaseHistory');
        
        // Always start with default empty data
        setData({ 
          profile: null, 
          history: [],
          totalSaved: 0,
          yearsToMillion: null
        });
        setLoading(false);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setLoading(false);
      }
    };

    initDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate summary stats
  const totalSaved = data?.totalSaved || 0;
  const purchaseHistory = data?.history || [];
  const yearsToMillion = data?.yearsToMillion;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Financial Dashboard</h1>
        <p className="dashboard-subtitle">Your Path to a Million</p>
      </div>

      <div className="dashboard-content">
        {/* Savings Summary Card */}
        <div className="dashboard-savings-card">
          <div className="savings-header">
            <h2>💰 Total Saved</h2>
            <p className="savings-subtitle">Tracking savings from smarter purchase decisions.</p>
          </div>
          
          <div className="savings-amount">
            <span className="amount">${totalSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <div className="savings-details">
            <div className="detail-item">
              <span className="detail-label">From finding better prices</span>
            </div>
          </div>

          {yearsToMillion !== null && yearsToMillion > 0 && (
            <div className="million-projection">
              <h3>Million Dollar Projection</h3>
              <p className="projection-years">~{yearsToMillion} Years</p>
              <p className="projection-note">At 15% annual compound growth.</p>
            </div>
          )}
        </div>

        {/* Purchase History Section */}
        {purchaseHistory.length > 0 ? (
          <div className="dashboard-history-card">
            <h2>📋 Purchase History</h2>
            <div className="history-list">
              {purchaseHistory.map((item, index) => (
                <div key={index} className="history-item">
                  <div className="history-date">{item.date}</div>
                  <div className="history-item-name">{item.itemName}</div>
                  <div className={`history-decision ${item.decision === 'Buy' ? 'buy' : 'dont-buy'}`}>
                    {item.decision}
                  </div>
                  {item.savings && (
                    <div className="history-savings">Saved: ${item.savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="dashboard-welcome-card">
            <h2>🎯 Start Tracking Your Savings</h2>
            <p>No purchase history yet. Start making smart decisions:</p>
            <ul>
              <li>✅ Complete your financial profile</li>
              <li>💡 Use the Purchase Advisor</li>
              <li>💬 Chat with BUD-DY</li>
              <li>📈 Track your savings</li>
            </ul>
            <div className="dashboard-actions">
              <button onClick={() => navigate('/profile')} className="btn btn-primary">
                Update Profile
              </button>
              <button onClick={() => navigate('/')} className="btn btn-secondary">
                Purchase Advisor
              </button>
              <button onClick={() => navigate('/chat')} className="btn btn-secondary">
                Chat with BUD-DY
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
