import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { Plus, Check, X, Calendar, Search, Filter, Loader } from 'lucide-react';
import TimeOffRequestModal from '../components/TimeOffRequestModal';

const Leave = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [activeTab, setActiveTab] = useState(isAdmin ? 'allocation' : 'timeoff');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Requests
    useEffect(() => {
        fetchLeaves();
    }, [isAdmin]);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const endpoint = isAdmin ? '/leaves/all' : '/leaves';
            const response = await api.get(endpoint);
            setRequests(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch leaves", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle New Request Submission
    const handleCreateRequest = async (newRequest) => {
        try {
            await api.post('/leaves', {
                 ...newRequest,
                 start_date: newRequest.startDate,
                 end_date: newRequest.endDate,
                 reason: newRequest.notes
            });
            fetchLeaves(); 
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to create leave", error);
            alert("Failed to apply leave");
        }
    };

    // Handle Admin Approval/Rejection
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/leaves/${id}/status`, { status: newStatus.toLowerCase(), comment: 'Admin action' });
            // Optimistic update
            setRequests(requests.map(req => 
                req.id === id ? { ...req, status: newStatus } : req
            ));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    // Filter logic is now handled by backend endpoints
    const displayedRequests = requests; 

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Area */}
            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    {!isAdmin && (
                        <button 
                            onClick={() => setActiveTab('timeoff')}
                            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'timeoff' ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            Time Off
                        </button>
                    )}
                    {isAdmin && (
                        <button 
                            onClick={() => setActiveTab('allocation')}
                            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'allocation' ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            Allocation
                        </button>
                    )}
                </div>

                {/* Controls & Balances */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        
                        {/* Left: Buttons & Search */}
                        <div className="space-y-4 w-full md:w-auto">
                            {!isAdmin && (
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-violet-500/20 transition-all uppercase tracking-wide text-sm flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" /> New
                                </button>
                            )}
                            
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search Requests..." 
                                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                                />
                            </div>
                        </div>

                        {/* Right: Balances */}
                        <div className="flex gap-8 md:gap-12">
                            <div className="text-center">
                                <p className="text-sm font-bold text-sky-600 uppercase tracking-wide mb-1">Paid Time Off</p>
                                <p className="text-3xl font-extrabold text-slate-800">24 <span className="text-xs text-slate-400 font-medium">Days Available</span></p>
                            </div>
                            <div className="text-center border-l border-slate-100 pl-8">
                                <p className="text-sm font-bold text-cyan-600 uppercase tracking-wide mb-1">Sick Time Off</p>
                                <p className="text-3xl font-extrabold text-slate-800">07 <span className="text-xs text-slate-400 font-medium">Days Available</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Start Date</th>
                            <th className="px-6 py-4">End Date</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Duration</th>
                            <th className="px-6 py-4">Status</th>
                            {isAdmin && <th className="px-6 py-4 text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                             <tr><td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center text-slate-400"><Loader className="h-6 w-6 animate-spin mx-auto"/></td></tr>
                        ) : displayedRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-800">{req.user?.name || req.name}</td>
                                <td className="px-6 py-4 font-mono text-slate-600">{req.start_date || req.startDate}</td>
                                <td className="px-6 py-4 font-mono text-slate-600">{req.end_date || req.endDate}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        req.type === 'Paid Time Off' ? 'bg-sky-100 text-sky-700' : 
                                        req.type === 'Sick Time Off' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {req.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-600">{req.days || req.duration} Days</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                                        req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                        req.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${
                                            req.status === 'approved' ? 'bg-emerald-500' :
                                            req.status === 'rejected' ? 'bg-rose-500' :
                                            'bg-amber-500'
                                        }`}></span>
                                        {req.status}
                                    </span>
                                </td>
                                
                                {isAdmin && (
                                    <td className="px-6 py-4">
                                        {req.status === 'pending' && (
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => handleStatusUpdate(req.id, 'Approved')}
                                                    className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md hover:bg-emerald-200 transition-colors" 
                                                    title="Approve"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(req.id, 'Rejected')}
                                                    className="p-1.5 bg-rose-100 text-rose-600 rounded-md hover:bg-rose-200 transition-colors" 
                                                    title="Reject"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {!loading && displayedRequests.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center text-slate-400 italic">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <TimeOffRequestModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                userName={user?.name}
                onSubmit={handleCreateRequest}
            />
        </div>
    );
};

export default Leave;
