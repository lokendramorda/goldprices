import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home"; 
import PriceDisplay from "./components/PriceDisplay";
import ItemUpload from "./components/ItemUpload"; 
import LoginPage from "./components/LoginPage";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem('isAdmin');
    };
  
    window.addEventListener('beforeunload', handleUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);
  

  return (
    <Router>
      <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prices" element={<PriceDisplay />} />
          <Route
            path="/upload"
            element={
              isAdmin ? (
                <ItemUpload />
              ) : (
                <LoginPage onLogin={(status) => setIsAdmin(status)} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
