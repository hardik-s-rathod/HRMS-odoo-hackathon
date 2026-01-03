import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LayoutGrid, Upload, User, Mail, Phone, Lock, Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    
    // Form State
    const [formData, setFormData] = useState({
        companyName: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
            company_name: formData.companyName,
            phone_number: formData.phone
        });

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
             {/* Abstract Background Shapes */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-200/50 blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-200/50 blur-3xl"></div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl w-full max-w-lg shadow-xl relative z-10 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
                
                 {/* Header */}
                 <div className="px-8 pt-8 pb-4 text-center">
                    <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30 text-white transform -rotate-6">
                         <LayoutGrid className="h-7 w-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
                    <p className="text-slate-500 text-sm mt-1">Register your company to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium animate-[fadeIn_0.3s_ease-out]">
                            {error}
                        </div>
                    )}
                    
                    {/* Company Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Company Name</label>
                        <div className="relative group">
                            <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                            <input 
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium placeholder-slate-400"
                                placeholder="Acme Inc."
                                required 
                            />
                        </div>
                    </div>

                    {/* Name & Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Admin Name</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                <input 
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium placeholder-slate-400"
                                    placeholder="John Doe"
                                    required 
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Phone</label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                <input 
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium placeholder-slate-400"
                                    placeholder="+1 (555) 000-0000"
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                            <input 
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium placeholder-slate-400"
                                placeholder="name@company.com"
                                required 
                            />
                        </div>
                    </div>

                    {/* Password & Confirm Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium placeholder-slate-400"
                                    placeholder="••••••••"
                                    required 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Confirm</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium placeholder-slate-400"
                                    placeholder="••••••••"
                                    required 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all duration-200 group mt-4"
                    >
                        Create Account
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="text-center pt-2">
                         <span className="text-slate-500 text-sm">Already have an account? </span>
                         <Link to="/login" className="text-violet-600 font-bold hover:text-violet-700 hover:underline text-sm transition-colors">Sign In</Link>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Register;
