import React from 'react';
import './Sidebar.scss';

function Sidebar() {
    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    <li>Home</li>
                    <li>Trending</li>
                    <li>Subscriptions</li>
                    <li>Library</li>
                    <li>History</li>
                    <li>Watch Later</li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
