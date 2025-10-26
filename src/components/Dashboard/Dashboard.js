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
        
        // Load fresh data from Firestore if available
        if (firestore.isAuthenticated) {
          const profile = await firestore.getProfile();
          const history = await firestore.getPurchaseHistory();
          setData({ profile, history });
        }
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Financial Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to your financial overview</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-welcome-card">
          <h2>🎯 Start Fresh</h2>
          <p>Your financial dashboard has been reset. You can now:</p>
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
      </div>
    </div>
  );
};

export default Dashboard;
