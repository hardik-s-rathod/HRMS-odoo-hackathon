import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutGrid, LogOut, User, ChevronDown } from 'lucide-react';

const TopNavbar = () => {
    const { user, logout, attendanceStatus, toggleAttendance } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Employees' },
        { path: '/attendance', label: 'Attendance' },
        { path: '/leave', label: 'Time Off' },
    ];

    return (
        <nav className="h-14 bg-slate-800 text-white flex items-center justify-between px-4 sticky top-0 z-50 shadow-md">
            {/* Left: Logo & Nav */}
            <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
                    <div className="bg-white/10 p-1.5 rounded-lg">
                        <LayoutGrid className="h-5 w-5" />
                    </div>
                    <span>HRMS</span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    {navItems.map(item => (
                        <NavLink 
                            key={item.path} 
                            to={item.path}
                            className={({ isActive }) => `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                isActive ? 'bg-white/10 text-white shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Attendance Systray */}
                <button 
                    onClick={toggleAttendance}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/50 hover:bg-slate-700 border border-slate-600 transition-all group"
                    title={attendanceStatus === 'checked-in' ? 'Click to Check Out' : 'Click to Check In'}
                >
                    <div className={`h-3 w-3 rounded-full shadow-sm animate-pulse ${attendanceStatus === 'checked-in' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50'}`}></div>
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white">
                        {attendanceStatus === 'checked-in' ? 'Check Out' : 'Check In'}
                    </span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 hover:bg-white/5 pr-2 pl-1 py-1 rounded-lg transition-colors focus:outline-none"
                    >
                        <div className="h-8 w-8 rounded bg-violet-500 flex items-center justify-center text-sm font-bold shadow-sm">
                            {user?.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-100 py-1 z-20 animate-[fadeIn_0.1s_ease-out]">
                                <Link 
                                    to="/profile" 
                                    onClick={() => setShowDropdown(false)}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                                >
                                    <User className="h-4 w-4 text-slate-400" />
                                    My Profile
                                </Link>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-rose-50 text-rose-600 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default TopNavbar;
