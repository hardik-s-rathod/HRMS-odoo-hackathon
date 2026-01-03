import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, User, Calendar, Clock, LogOut, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();
    
    const navItems = [
        { path: '/', icon: LayoutGrid, label: 'Apps' },
        { path: '/employees', icon: Users, label: 'Employees' },
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/attendance', icon: Clock, label: 'Attendance' },
        { path: '/leave', icon: Calendar, label: 'Leave' },
    ];

    return (
        <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 text-slate-600 flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300">
            <div className="h-16 flex items-center justify-center border-b border-slate-100">
                <div className=" bg-violet-600 text-white p-2 rounded-lg">
                    <LayoutGrid className="h-6 w-6" />
                </div>
                <span className="ml-3 font-bold text-xl text-slate-800 hidden lg:block">HRMS</span>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                                isActive
                                    ? 'bg-violet-50 text-violet-600 font-semibold'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <item.icon className={`h-6 w-6 lg:h-5 lg:w-5 transition-transform ${({isActive}) => isActive ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span className="hidden lg:block">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all group"
                >
                    <LogOut className="h-6 w-6 lg:h-5 lg:w-5" />
                    <span className="hidden lg:block font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
