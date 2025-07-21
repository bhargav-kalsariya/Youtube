import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import SearchResults from './pages/SearchResults/SearchResults';
import Trending from './pages/Trending/Trending';
import WatchHistory from './pages/WatchHistory/WatchHistory';
import Settings from './pages/Settings/Settings';
import Ifunauthorized from './components/Ifunauthorized';
import CreateVideo from './components/CreateVideo/CreateVideo';
import Profile from './components/Profile/Profile';
import UpdateProfile from './components/UpdateProfile/UpdateProfile';
import Subscriptions from './components/Subscriptions/Subscriptions';
import VideoPlayerPage from './components/VideoPlayerPage/VideoPlayerPage';
import LikedVideos from './components/LikedVideos/LikedVideos';
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';
import { useSidebar } from './context/SidebarContext';

function App() {
    const { isSidebarOpen } = useSidebar();
    return (
        <div className="App">
            <Routes>

                <Route path='/' element={<Home />}></Route>
                <Route path='/search' element={<SearchResults />}></Route>
                <Route path='/trending' element={<Trending />}></Route>
                <Route path='/history' element={<WatchHistory />}></Route>
                <Route path='/settings' element={<Settings />}></Route>
                <Route path='/create-video' element={
                    <>
                        <Header />
                        <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                            <SideBar />
                            <CreateVideo />
                        </div>
                    </>
                } />
                <Route path='/profile/:userId' element={<Profile />} />
                <Route path='/updateProfile' element={<UpdateProfile />} />
                <Route path='/subscription' element={<Subscriptions />} />
                <Route path='/videoPlayerPage/:videoId' element={<VideoPlayerPage />} />
                <Route path='/likedVideos' element={<LikedVideos />} />

                <Route element={<Ifunauthorized />}>

                    <Route path='signup' element={<Signup />}></Route>
                    <Route path='login' element={<Login />}></Route>

                </Route>
            </Routes>
        </div >
    );
}

export default App;
