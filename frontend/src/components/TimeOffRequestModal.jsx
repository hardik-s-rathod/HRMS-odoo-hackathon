import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar, Clock } from 'lucide-react';

const TimeOffRequestModal = ({ isOpen, onClose, userName, onSubmit }) => {
    const [formData, setFormData] = useState({
        type: 'Paid Time Off',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [duration, setDuration] = useState('0.00');

    // Calculate duration when dates change
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
            setDuration(diffDays > 0 ? diffDays.toFixed(2) : '0.00');
        } else {
            setDuration('0.00');
        }
    }, [formData.startDate, formData.endDate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            duration: duration,
            status: 'Pending',
            attachment: 'No file'
        });
        onClose();
        // Reset form
        setFormData({ type: 'Paid Time Off', startDate: '', endDate: '', reason: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">Time Off Request</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Employee Read-only */}
                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-semibold text-slate-500">Employee</label>
                        <div className="col-span-2 text-slate-800 font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                            {userName}
                        </div>
                    </div>

                    {/* Type Selection */}
                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-semibold text-slate-500">Time Off Type</label>
                        <select 
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="col-span-2 bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5"
                        >
                            <option>Paid Time Off</option>
                            <option>Sick Time Off</option>
                            <option>Unpaid</option>
                        </select>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-3 items-start gap-4">
                        <label className="text-sm font-semibold text-slate-500 mt-2">Validity Period</label>
                        <div className="col-span-2 space-y-3">
                            <div className="flex items-center gap-3">
                                <input 
                                    type="date" 
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg block w-full p-2.5"
                                />
                                <span className="text-slate-400">to</span>
                                <input 
                                    type="date" 
                                    required
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg block w-full p-2.5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Allocation */}
                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-semibold text-slate-500">Allocation</label>
                        <div className="col-span-2 flex items-center gap-2 text-violet-600 font-bold text-lg">
                            <Clock className="h-5 w-5" />
                            {duration} Days
                        </div>
                    </div>

                    {/* Attachment */}
                    <div className="grid grid-cols-3 items-start gap-4">
                        <label className="text-sm font-semibold text-slate-500 mt-1">Attachment</label>
                        <div className="col-span-2">
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-6 h-6 mb-2 text-slate-400" />
                                        <p className="text-xs text-slate-500">Click to upload (for sick leave)</p>
                                    </div>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button 
                            type="submit" 
                            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-violet-500/20"
                        >
                            Submit
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-6 rounded-lg transition-colors"
                        >
                            Discard
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TimeOffRequestModal;
