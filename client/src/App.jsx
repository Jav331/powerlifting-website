import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./pages/Home";
import Plan from './pages/Plan';
import Calculate from './pages/Calculate';
import Compare from './pages/Compare';
import Track from './pages/Track';
import Login from './pages/Login';
import Register from './pages/Register';
import { Route, Routes } from "react-router-dom";

import './App.css'


function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculate" element={<Calculate />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/compare" element={<Compare />} />
          <Route 
            path="/track" 
            element={
              <ProtectedRoute>
                <Track />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  )
}

export default App