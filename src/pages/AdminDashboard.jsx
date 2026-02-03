import { useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState('');

  const handleRetrieve = async (e) => {
    e.preventDefault();
    
    if (accessCode.length !== 4 || !/^\d+$/.test(accessCode)) {
      setError('Please enter a valid 4-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8000/api/admin/retrieve/${accessCode}`);
      const data = await response.json();

      if (data.success) {
        setSessionData(data.data);
      } else {
        setError(data.error || 'Unable to retrieve session');
        setSessionData(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to connect to server');
      setSessionData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAccessCode('');
    setSessionData(null);
    setError('');
  };

  const renderMessageContent = (content) => {
    try {
      // If content is a JSON string, parse it and extract 'message'
      const parsed = JSON.parse(content);
      return parsed.message || parsed.reply || content; 
    } catch (e) {
      // If not JSON, return as is
      return content;
    }
  };

  if (sessionData) {
    return (
      <div className="admin-dashboard dark-mode">
        <div className="admin-container">
          {/* Header */}
          <div className="admin-header">
            <h1>Support Session Details</h1>
            <button className="reset-btn" onClick={handleReset}>← Back to Code Entry</button>
          </div>

          {/* User Info Card */}
          <div className="user-info-card">
            <div className="user-header">
              <div className="user-details">
                <h2>{sessionData.user_name}</h2>
                <span className="user-tier">{sessionData.user_tier} Tier</span>
              </div>
              <div className="session-id">Session: {sessionData.session_id}</div>
            </div>
          </div>

          {/* Agentic Insights Analysis */}
          {sessionData.insights ? (
            <div className="analysis-panel">
              <h3>AI Agent Analysis</h3>
              <div className="analysis-grid">
                
                {/* Sentiment */}
                <div className="analysis-card sentiment-card">
                  <h4>Customer Sentiment</h4>
                  <span className={`sentiment-badge ${sessionData.insights.sentiment.toLowerCase()}`}>
                    {sessionData.insights.sentiment}
                  </span>
                </div>

                {/* Summary */}
                <div className="analysis-card">
                  <h4>Situation Summary</h4>
                  <p>{sessionData.insights.summary}</p>
                </div>

                {/* Solution */}
                <div className="analysis-card solution-card">
                  <h4>Suggested Solution</h4>
                  <p>{sessionData.insights.solution}</p>
                </div>

              </div>
            </div>
          ) : (
             /* Fallback for older records */
            <div className="escalation-reason">
              <h3>Reason for Escalation</h3>
              <div className="reason-banner">{sessionData.reason}</div>
            </div>
          )}

          {/* Chat History */}
          <div className="chat-history-container">
            <h3>Chat History</h3>
            <div className="chat-history">
              {sessionData.history && sessionData.history.length > 0 ? (
                sessionData.history
                  .filter((msg) => msg.role !== 'system')
                  .map((msg, idx) => (
                    <div
                      key={idx}
                      className={`chat-message ${msg.role === 'user' ? 'user-msg' : 'bot-msg'}`}
                    >
                      <div className="message-sender">
                        {msg.role === 'user' ? '👤 User' : '🤖 Bot'}
                      </div>
                      <div className="message-content">
                        {renderMessageContent(msg.content)}
                      </div>
                    </div>
                  ))
              ) : (
                <p className="no-history">No chat history available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard dark-mode">
      <div className="admin-container">
        <div className="code-entry-card">
          <div className="card-header">
            <h1>Support Agent Access</h1>
            <p>Enter the 4-digit code provided by the customer</p>
          </div>

          <form onSubmit={handleRetrieve} className="code-form">
            <div className="input-group">
              <input
                type="text"
                maxLength="4"
                placeholder="0000"
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value.replace(/[^0-9]/g, ''));
                  setError('');
                }}
                className="code-input"
                disabled={isLoading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="retrieve-btn"
              disabled={isLoading || accessCode.length !== 4}
            >
              {isLoading ? 'Loading...' : 'Retrieve Session'}
            </button>
          </form>

          <div className="info-text">
            <p>This dashboard allows support agents to access customer chat history using the escalation code.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
