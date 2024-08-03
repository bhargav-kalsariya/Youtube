import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Ifunauthorized from './components/Ifunauthorized';
import CreateVideo from './components/CreateVideo/CreateVideo';
import Profile from './components/Profile/Profile';
import UpdateProfile from './components/UpdateProfile/UpdateProfile';
import Subscriptions from './components/Subscriptions/Subscriptions';
import VideoPlayerPage from './components/VideoPlayerPage/VideoPlayerPage';

function App() {
    return (
        <div className="App">
            <Routes>

                <Route path='/' element={<Home />}></Route>
                <Route path='/create-video' element={<CreateVideo />}></Route>
                <Route path='/profile/:userId' element={<Profile />} />
                <Route path='/updateProfile' element={<UpdateProfile />} />
                <Route path='/subscription' element={<Subscriptions />} />
                <Route path='/videoPlayerPage' element={<VideoPlayerPage />} />

                <Route element={<Ifunauthorized />}>

                    <Route path='signup' element={<Signup />}></Route>
                    <Route path='login' element={<Login />}></Route>

                </Route>
            </Routes>
        </div >
    );
}

export default App;
