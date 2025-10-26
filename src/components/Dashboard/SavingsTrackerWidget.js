// src/components/Dashboard/SavingsTrackerWidget.js
import React, { useState, useEffect } from 'react';

const SavingsTrackerWidget = ({ totalSavings, userId }) => {
  const [savingsGoal, setSavingsGoal] = useState(1000);
  const [goalDescription, setGoalDescription] = useState('Emergency Fund');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(savingsGoal);
  const [tempDescription, setTempDescription] = useState(goalDescription);

  // Load savings goal from localStorage
  useEffect(() => {
    const loadGoal = () => {
      if (!userId) return;
      
      try {
        const stored = localStorage.getItem(`savingsGoal_${userId}`);
        if (stored) {
          const data = JSON.parse(stored);
          setSavingsGoal(data.amount || 1000);
          setGoalDescription(data.description || 'Emergency Fund');
          setTempGoal(data.amount || 1000);
          setTempDescription(data.description || 'Emergency Fund');
        }
      } catch (error) {
        console.error('Error loading savings goal:', error);
      }
    };

    loadGoal();
  }, [userId]);

  // Save goal to localStorage
  const saveGoal = async () => {
    if (!userId) return;
    
    try {
      localStorage.setItem(`savingsGoal_${userId}`, JSON.stringify({
        amount: tempGoal,
        description: tempDescription,
        updatedAt: new Date()
      }));
      
      setSavingsGoal(tempGoal);
      setGoalDescription(tempDescription);
      setIsEditingGoal(false);
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  // Calculate progress
  const progress = Math.min((totalSavings / savingsGoal) * 100, 100);
  const remainingAmount = Math.max(savingsGoal - totalSavings, 0);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Milestone messages
  const getMilestoneMessage = () => {
    if (progress >= 100) return "🎉 Goal achieved! Time to set a new one!";
    if (progress >= 75) return "🔥 Almost there! Keep going!";
    if (progress >= 50) return "💪 Halfway to your goal!";
    if (progress >= 25) return "🚀 Great progress!";
    return "🌟 Every dollar saved counts!";
  };

  return (
    <div className="widget savings-tracker-widget">
      <div className="widget-header">
        <h3>
          <span className="widget-icon">💰</span>
          BUD-DY Savings Tracker
        </h3>
        <button
          className="edit-goal-btn"
          onClick={() => setIsEditingGoal(!isEditingGoal)}
          title="Edit savings goal"
        >
          {isEditingGoal ? '✓' : '✏️'}
        </button>
      </div>

      <div className="widget-content">
        {/* Total Savings Display */}
        <div className="total-savings">
          <div className="savings-label">Total Saved with BUD-DY</div>
          <div className="savings-amount">{formatCurrency(totalSavings)}</div>
          <div className="savings-sublabel">
            from smart purchase decisions
          </div>
        </div>

        {/* Goal Editor */}
        {isEditingGoal ? (
          <div className="goal-editor">
            <div className="goal-input-group">
              <label>Goal Description</label>
              <input
                type="text"
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                placeholder="What are you saving for?"
                className="goal-description-input"
              />
            </div>
            <div className="goal-input-group">
              <label>Goal Amount</label>
              <input
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(Math.max(1, parseInt(e.target.value) || 0))}
                placeholder="Goal amount"
                className="goal-amount-input"
                min="1"
              />
            </div>
            <div className="goal-actions">
              <button onClick={saveGoal} className="btn-save">
                Save Goal
              </button>
              <button 
                onClick={() => {
                  setIsEditingGoal(false);
                  setTempGoal(savingsGoal);
                  setTempDescription(goalDescription);
                }} 
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="goal-display">
            <div className="goal-info">
              <span className="goal-label">Goal:</span>
              <span className="goal-text">{goalDescription}</span>
              <span className="goal-target">{formatCurrency(savingsGoal)}</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${progress}%`,
                backgroundColor: progress >= 100 ? '#10b981' : 
                               progress >= 50 ? '#3b82f6' : '#8b5cf6'
              }}
            >
              <span className="progress-percentage">
                {progress.toFixed(0)}%
              </span>
            </div>
          </div>
          
          <div className="progress-details">
            <div className="progress-stat">
              <span className="stat-label">Saved</span>
              <span className="stat-value">{formatCurrency(totalSavings)}</span>
            </div>
            <div className="progress-stat">
              <span className="stat-label">Remaining</span>
              <span className="stat-value">{formatCurrency(remainingAmount)}</span>
            </div>
          </div>
        </div>

        {/* Milestone Message */}
        <div className="milestone-message">
          {getMilestoneMessage()}
        </div>

        {/* Motivational Stats */}
        <div className="savings-stats">
          <div className="stat-item">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-number">
                {totalSavings > 0 ? Math.ceil(remainingAmount / (totalSavings / 30)) : '∞'}
              </div>
              <div className="stat-label">days to goal</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">☕</div>
            <div className="stat-content">
              <div className="stat-number">
                {Math.floor(totalSavings / 5)}
              </div>
              <div className="stat-label">coffees worth</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {progress >= 100 && (
          <div className="goal-achieved">
            <p>🎊 Congratulations! You've reached your savings goal!</p>
            <button 
              onClick={() => setIsEditingGoal(true)} 
              className="new-goal-btn"
            >
              Set New Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsTrackerWidget;