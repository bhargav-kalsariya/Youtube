import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};

export const SidebarProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const openSidebar = () => {
        setIsSidebarOpen(true);
    };

    return (
        <SidebarContext.Provider value={{
            isSidebarOpen,
            toggleSidebar,
            closeSidebar,
            openSidebar
        }}>
            {children}
        </SidebarContext.Provider>
    );
}; 