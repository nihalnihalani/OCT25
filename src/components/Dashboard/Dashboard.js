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

  // Load dashboard data
  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        
        // Load purchase history from localStorage or Firestore
        let history = [];
        let totalSaved = 0;
        
        // Try to load from Firestore first
        if (firestore.isAuthenticated) {
          try {
            const firestoreHistory = await firestore.getPurchaseHistory();
            if (firestoreHistory && firestoreHistory.length > 0) {
              history = firestoreHistory;
            }
          } catch (error) {
            console.error('Error loading from Firestore:', error);
          }
        }
        
        // Fallback to localStorage if no Firestore data
        if (history.length === 0) {
          const storedHistory = localStorage.getItem('purchaseHistory');
          if (storedHistory) {
            try {
              history = JSON.parse(storedHistory);
            } catch (error) {
              console.error('Error parsing stored history:', error);
              history = [];
            }
          }
        }
        
        // Calculate total saved from history
        totalSaved = history.reduce((sum, item) => {
          if (item.decision === "Don't Buy") {
            return sum + (item.itemCost || 0);
          } else if (item.decision === "Buy" && item.savings) {
            return sum + (item.savings || 0);
          }
          return sum;
        }, 0);
        
        // Calculate years to million if we have savings
        let yearsToMillion = null;
        if (totalSaved > 0) {
          // Compound interest calculation: A = P(1 + r)^n
          // Solving for n: n = log(A/P) / log(1 + r)
          const target = 1000000;
          const rate = 0.15;
          yearsToMillion = Math.log(target / totalSaved) / Math.log(1 + rate);
          yearsToMillion = Math.ceil(yearsToMillion);
        }
        
        setData({ 
          profile: null, 
          history: history,
          totalSaved: totalSaved,
          yearsToMillion: yearsToMillion
        });
        setLoading(false);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setLoading(false);
      }
    };

    initDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore.isAuthenticated]);

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
