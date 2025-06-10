import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import Credits from './components/Credits';
import Room from './components/Room';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/room' element={<Room />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/credits' element={<Credits />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
