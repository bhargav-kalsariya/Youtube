import React from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import VideoGrid from './components/VideoGrid/VideoGrid';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <Sidebar />
        <VideoGrid />
      </div>
    </div>
  );
}

export default App;
