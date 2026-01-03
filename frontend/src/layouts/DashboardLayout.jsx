import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <TopNavbar />
            
            <main className="max-w-[1920px] mx-auto">
                <div className="p-6 animate-[fadeIn_0.3s_ease-out]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
