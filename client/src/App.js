// import logo from './logo.svg';
// import './App.css';
// import './components/register/register'
// import Register from './components/register/register';
// import Login from './components/login/login';

// function App() {
//   return (
//     <Register></Register>,
//     <Login></Login>
//   );
// }

// export default App;

import './App.css'
import Homepage from "./components/homepage/homepage"
import Login from "./components/login/login"
import Register from "./components/register/register"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';

function App() {
  const [ user, setLoginUser] = useState({})
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage />}>
          </Route>
          <Route path="/login" element={<Login />}>
          </Route>
          <Route path="/register" element={<Register />}>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;