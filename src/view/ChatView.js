import AppLogo from "../assets/app-logo.png";
import ChipLogo from "../assets/microchip.png";
import { useState, useEffect } from 'react';
import { ChatController } from '../controller/ChatController';
import { createTable, insertMessage, getLastMessage } from '../db';


export function ChatView() {
  const [userPrompt, setUserPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
  
 
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsAuthenticated(true);
     
     
    fetchUserData(storedUsername);
     
    }
    else{
      setIsAuthenticated(false);
    }
  }, []);
  const fetchUserData=async(storedUsername)=>{
    const row = await getLastMessage(storedUsername);
    console.log(`User message:${row.prompt}`);
    if (row!=null) {
      setUserPrompt(row.prompt);
      setResponse(row.response);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get the chatbot response
    const result = await ChatController.getResponse(userPrompt);

    setLoading(false);
    setResponse(result);

    insertMessage(username, userPrompt, result);

    setUserPrompt('');

    // console.log(`User message: ${userPrompt} | Chatbot response: ${result}`);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsAuthenticated(true);
      fetchUserData(storedUsername);
     
    } else {
      const newUsername = prompt('Enter a username:');
      setUsername(newUsername);
      setIsAuthenticated(true);
      localStorage.setItem('username', newUsername);
      fetchUserData(newUsername);
    }
   
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
    setIsAuthenticated(false);
    setUserPrompt('');
    setResponse('');
  };

  if (!isAuthenticated) {
    return (
      <div className="wrapper">
        <p>Please login to continue.</p>
        <form onSubmit={handleLogin}>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <p className="response-area">
        {loading ? 'loading...' : response}
      </p>
      <img src={AppLogo} alt="" className="app-logo" />
      <form onSubmit={handleSubmit}>
        <img src={ChipLogo} alt="" className={loading ? 'cg-logo loading' : 'cg-logo'} />
        <input
          type="text"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Ask anything... :)"
        />
        <button type="submit">Ask</button>
      </form>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}