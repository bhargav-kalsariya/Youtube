import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route>

                    <Route path='/' element={<Home />}></Route>
                    <Route path='signup' element={<Signup />}></Route>
                    <Route path='login' element={<Login />}></Route>

                </Route>
            </Routes>
        </div >
    );
}

export default App;