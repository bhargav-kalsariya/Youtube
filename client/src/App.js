import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route>

                    <Route path='signup' element={<Signup />}></Route>

                </Route>
            </Routes>
        </div>
    );
}

export default App;
