import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 

import About from '../components/about';
import Signup from '../components/signup';
import Login from '../components/login';
import DashbordMain from '../components/dashboard-main'; 
import UserProfile from '../components/user-profile';
import SavePost from '../components/save-post';
import Notification from '../components/dash-notification';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashbordMain />} /> 
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/savedpost" element={<SavePost />} />
        <Route path="/notification" element={<Notification />}></Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
