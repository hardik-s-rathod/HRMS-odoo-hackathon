import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft, ChevronRight, Calendar, User, Search, Users, Clock, AlertCircle } from 'lucide-react';

const Attendance = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    
    // State
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMonth, setViewMonth] = useState('October');
    const [searchQuery, setSearchQuery] = useState('');

    // --- MOCK DATA ---
    // 1. Employee Monthly Data (Logged-in User)
    const employeeLogs = [
        { date: '28/10/2025', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extra: '00:00', status: 'present' },
        { date: '29/10/2025', checkIn: '10:00', checkOut: '20:00', workHours: '10:00', extra: '01:00', status: 'present' },
        { date: '30/10/2025', checkIn: '10:15', checkOut: '19:15', workHours: '09:00', extra: '00:00', status: 'present' },
        { date: '31/10/2025', checkIn: '-', checkOut: '-', workHours: '-', extra: '-', status: 'absent' },
    ];

    // 2. Admin Daily Data (All Employees for Selected Date)
    const adminLogs = [
        { id: 1, name: 'John Doe', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extra: '01:00' },
        { id: 2, name: 'Sarah Smith', checkIn: '10:00', checkOut: '19:00', workHours: '09:00', extra: '01:00' },
        { id: 3, name: 'Mike Johnson', checkIn: '09:30', checkOut: '18:30', workHours: '09:00', extra: '00:00' },
        { id: 4, name: 'Emily Davis', checkIn: '10:15', checkOut: '19:45', workHours: '09:30', extra: '00:30' },
    ];

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const handlePrevDate = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const handleNextDate = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    // --- RENDER HELPERS ---
    const StatBox = ({ title, value, subtext }) => (
        <div className="bg-slate-800 text-white rounded-xl p-4 flex flex-col items-center justify-center min-w-[140px] border border-slate-700 shadow-lg">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 text-center">{title}</span>
            <span className="text-2xl font-bold font-mono">{value}</span>
            {subtext && <span className="text-xs text-emerald-400 mt-1">{subtext}</span>}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header / Controls */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {isAdmin ? (
                        <>
                            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                                <button onClick={handlePrevDate} className="p-2 hover:bg-white rounded-md transition-shadow shadow-sm"><ChevronLeft className="h-5 w-5 text-slate-600" /></button>
                                <div className="px-4 font-mono font-bold text-slate-700 min-w-[160px] text-center">
                                    {formatDate(selectedDate)}
                                </div>
                                <button onClick={handleNextDate} className="p-2 hover:bg-white rounded-md transition-shadow shadow-sm"><ChevronRight className="h-5 w-5 text-slate-600" /></button>
                            </div>
                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search Employee..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-violet-600" />
                                Attendance
                            </h2>
                            <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-bold">
                                {viewMonth} 2025
                            </span>
                        </div>
                    )}
                </div>

                {/* Employee Stats (Only Visible to Employee) */}
                {!isAdmin && (
                    <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto justify-start md:justify-end">
                        <StatBox title="Present" value="22" subtext="Days" />
                        <StatBox title="Leaves" value="02" subtext="Approved" />
                        <StatBox title="Payable" value="26" />
                    </div>
                )}
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider border-b border-slate-200">
                            <tr>
                                {isAdmin ? (
                                    <th className="px-6 py-4">Employee</th>
                                ) : (
                                    <th className="px-6 py-4">Date</th>
                                )}
                                <th className="px-6 py-4">Check In</th>
                                <th className="px-6 py-4">Check Out</th>
                                <th className="px-6 py-4">Work Hours</th>
                                <th className="px-6 py-4">Extra Hours</th>
                                {!isAdmin && <th className="px-6 py-4 text-center">Status</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                            {isAdmin ? (
                                // --- ADMIN ROW ---
                                adminLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                                    {log.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-slate-800">{log.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono">{log.checkIn}</td>
                                        <td className="px-6 py-4 font-mono">{log.checkOut}</td>
                                        <td className="px-6 py-4 font-mono text-emerald-600 font-bold">{log.workHours}</td>
                                        <td className="px-6 py-4 font-mono text-violet-600">{log.extra}</td>
                                    </tr>
                                ))
                            ) : (
                                // --- EMPLOYEE ROW ---
                                employeeLogs.map((log, index) => (
                                    <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 font-mono text-slate-500">{log.date}</td>
                                        <td className="px-6 py-4 font-mono">{log.checkIn}</td>
                                        <td className="px-6 py-4 font-mono">{log.checkOut}</td>
                                        <td className="px-6 py-4 font-mono text-emerald-600 font-bold">{log.workHours}</td>
                                        <td className="px-6 py-4 font-mono text-violet-600">{log.extra}</td>
                                        <td className="px-6 py-4 text-center">
                                            {log.status === 'present' ? (
                                                <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" title="Present"></span>
                                            ) : (
                                                <span className="inline-flex h-3 w-3 rounded-full bg-rose-500" title="Absent"></span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Legend / Info */}
            <div className="flex gap-6 text-xs text-slate-400 px-2">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>Standard Work Time (09:00)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-violet-500"></span>
                    <span>Extra Hours (Overtime)</span>
                </div>
            </div>

        </div>
    );
};

export default Attendance;
