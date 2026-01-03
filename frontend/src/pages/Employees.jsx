import React, { useState } from 'react';
import { Users, Plus, Search, MoreVertical, Shield, UserCheck, Copy } from 'lucide-react';

const Employees = () => {
    const [showModal, setShowModal] = useState(false);
    const [employees, setEmployees] = useState([
        { id: 'OIJODO20230001', name: 'John Doe', email: 'john@odooindia.com', role: 'admin', joinDate: '2023-01-15' },
        { id: 'OISLJA20230002', name: 'Sarah Jane', email: 'sarah@odooindia.com', role: 'employee', joinDate: '2023-03-10' },
    ]);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        joinDate: '',
        email: '',
        phone: ''
    });

    const [generatedCreds, setGeneratedCreds] = useState(null);

    const generateId = () => {
        if (!formData.firstName || !formData.lastName || !formData.joinDate) return;

        const companyCode = 'OI';
        const nameCode = (formData.firstName.slice(0, 2) + formData.lastName.slice(0, 2)).toUpperCase();
        const year = new Date(formData.joinDate).getFullYear();
        // Mock serial number generation (in real app, fetch last ID from DB)
        const serial = String(employees.length + 1).padStart(4, '0');

        const newId = `${companyCode}${nameCode}${year}${serial}`;
        // Auto-generate password
        const password = Math.random().toString(36).slice(-8);

        setGeneratedCreds({ id: newId, password });
    };

    const handleAddEmployee = (e) => {
        e.preventDefault();
        if(!generatedCreds) generateId(); // Ensure ID is generated
        
        const newEmployee = {
            id: generatedCreds?.id || 'PENDING',
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            role: 'employee',
            joinDate: formData.joinDate
        };

        setEmployees([...employees, newEmployee]);
        setShowModal(false);
        // Reset form
        setFormData({ firstName: '', lastName: '', joinDate: '', email: '', phone: '' });
        setGeneratedCreds(null);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                     <h2 className="text-2xl font-bold text-slate-800">Employees</h2>
                     <p className="text-slate-500 mt-1">Manage system users and access</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-violet-500/20 flex items-center gap-2 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    Add Employee
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search employees..." 
                            className="bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 w-full"
                        />
                    </div>
                </div>
                
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Login ID</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Joining Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xs">
                                            {emp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800">{emp.name}</div>
                                            <div className="text-xs text-slate-400">{emp.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-500">{emp.id}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        emp.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'
                                    }`}>
                                        {emp.role === 'admin' && <Shield className="h-3 w-3" />}
                                        {emp.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{emp.joinDate}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Employee Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-[fadeIn_0.2s_ease-out] overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800">Add New Employee</h3>
                            <p className="text-slate-500 text-sm">System will auto-generate Login ID & Password</p>
                        </div>
                        
                        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <form onSubmit={handleAddEmployee} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
                                        <input 
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                            type="text" 
                                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
                                        <input 
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                            type="text" 
                                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                                    <input 
                                        required
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Joining Date</label>
                                    <input 
                                        required
                                        type="date" 
                                        value={formData.joinDate}
                                        onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none" 
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                                    <button 
                                        type="button" 
                                        onClick={generateId}
                                        className="flex-1 py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700"
                                    >
                                        Generate ID
                                    </button>
                                </div>
                            </form>

                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-center">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">System Generated Credentials</h4>
                                
                                {generatedCreds ? (
                                    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                                            <label className="text-xs text-slate-400 block mb-1">Login ID</label>
                                            <div className="flex justify-between items-center">
                                                <code className="text-violet-600 font-bold text-lg">{generatedCreds.id}</code>
                                                <Copy className="h-4 w-4 text-slate-300 cursor-pointer hover:text-slate-500" />
                                            </div>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                                            <label className="text-xs text-slate-400 block mb-1">Initial Password</label>
                                            <div className="flex justify-between items-center">
                                                <code className="text-slate-800 font-bold text-lg">{generatedCreds.password}</code>
                                                <Copy className="h-4 w-4 text-slate-300 cursor-pointer hover:text-slate-500" />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleAddEmployee}
                                            className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 mt-2"
                                        >
                                            Confirm & Create User
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-400 py-8">
                                        <UserCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Fill details and click "Generate ID" to preview credentials.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
