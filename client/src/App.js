import './App.css'
import Homepage from "./components/homepage/homepage"
import Login from "./components/login/login"
import Register from "./components/register/register"
import Dashboard from './components/dashboard/dashboard'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import { UserContextProvider } from './components/userContext';

function App() {
  const [ user, setLoginUser] = useState({})
  return (
    <div className="App">
      <UserContextProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage />}>
          </Route>
          <Route path="/login" element={<Login />}>
          </Route>
          <Route path="/register" element={<Register />}>
          </Route>
          <Route path="/dashboard" element={<Dashboard />}>
          </Route>
        </Routes>
      </Router>
      </UserContextProvider>
    </div>
  );
}

export default App;