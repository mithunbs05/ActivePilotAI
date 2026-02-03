import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Chatbot.css';

const Chatbot = () => {
  const { isChatbotOpen, toggleChatbot } = useApp();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your shopping assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Use persistent session ID from localStorage, or generate a new one
  const sessionId = useRef(localStorage.getItem('chat_session_id') || `session-${Math.random().toString(36).substr(2, 9)}`);
  
  // Store chat session history for escalation
  const CHAT_SESSIONS = useRef({});
  
  // Save session ID to localStorage on mount (if it was newly generated)
  useEffect(() => {
    localStorage.setItem('chat_session_id', sessionId.current);
  }, []);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId.current,
          message: userMessage.text
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      const botMessage = {
        id: messages.length + 2,
        text: data.reply, // Corrected: Using the processed reply which only contains the message text
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);

      // Store message in session for escalation
      if (!CHAT_SESSIONS.current[sessionId.current]) {
        CHAT_SESSIONS.current[sessionId.current] = [];
      }
      CHAT_SESSIONS.current[sessionId.current].push({ role: 'user', content: userMessage.text });
      CHAT_SESSIONS.current[sessionId.current].push({ role: 'assistant', content: data.reply });

      if (data.action === "NAVIGATE" && data.payload) {
        console.log("Navigating to:", data.payload);
        setTimeout(() => {
          navigate(data.payload);
          // Optional: Close chatbot on navigation?
          // toggleChatbot(); 
        }, 1000);
      }

      // Handle Escalation
      // Note: Data is now handled entirely in the backend response message
      // No need for separate frontend call
      /* 
      if (data.action === "ESCALATE") {
         // Logic moved to backend intervention layer
      }
      */
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting to the server right now. Please try again later.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        className={`chatbot-toggle ${isChatbotOpen ? 'open' : ''}`}
        onClick={toggleChatbot}
        aria-label="Toggle chatbot"
      >
        {isChatbotOpen ? '✕' : '💬'}
      </button>

      {isChatbotOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <div className="bot-avatar">🤖</div>
              <div className="bot-info">
                <h3>Shopping Assistant</h3>
                <span className="bot-status">Online</span>
              </div>
            </div>
            <button className="close-btn" onClick={toggleChatbot}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <div className="message-content">
                  ...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chatbot-input-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="chatbot-input"
            />
            <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
