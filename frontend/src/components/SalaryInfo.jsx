import React, { useState, useEffect } from 'react';

const SalaryInfo = ({ isAdmin }) => {
    // State for Monthly Wage Input
    const [monthlyWage, setMonthlyWage] = useState(50000);
    
    // Derived State for Salary Components
    const [components, setComponents] = useState({
        basic: 0,
        hra: 0,
        standardAllowance: 4167,
        performanceBonus: 0,
        lta: 0,
        fixedAllowance: 0,
        pf: 0,
        professionalTax: 200,
        totalYearly: 0
    });

    // Auto-Calculation Effect
    useEffect(() => {
        const mw = parseFloat(monthlyWage) || 0;
        
        // 1. Basic (50% of Wage)
        const basic = mw * 0.50;
        
        // 2. HRA (50% of Basic)
        const hra = basic * 0.50;
        
        // 3. Fixed Standard Allowance
        const stdAllow = 4167; // Fixed per month

        // 4. Performance Bonus (8.33% of Basic)
        const perfBonus = basic * 0.0833;

        // 5. LTA (8.33% of Basic)
        const lta = basic * 0.0833;

        // 6. Fixed Allowance (Balancing Component)
        // Formula: Wage - (Basic + HRA + StdAllow + PerfBonus + LTA)
        const sumAllocated = basic + hra + stdAllow + perfBonus + lta;
        const fixedAllow = Math.max(0, mw - sumAllocated);

        // Deductions
        // 7. PF (12% of Basic)
        const pf = basic * 0.12;

        setComponents({
            basic: basic.toFixed(2),
            hra: hra.toFixed(2),
            standardAllowance: stdAllow.toFixed(2),
            performanceBonus: perfBonus.toFixed(2),
            lta: lta.toFixed(2),
            fixedAllowance: fixedAllow.toFixed(2),
            pf: pf.toFixed(2),
            professionalTax: 200.00,
            totalYearly: (mw * 12).toFixed(2)
        });

    }, [monthlyWage]);

    return (
        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            {/* Header / Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-700/50 pb-8">
                <div>
                    <label className="block text-slate-400 text-sm font-semibold mb-2">Monthly Wage</label>
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-500 font-bold">₹</span>
                        <input 
                            type="number" 
                            value={monthlyWage}
                            onChange={(e) => isAdmin && setMonthlyWage(e.target.value)}
                            disabled={!isAdmin}
                            className={`w-full bg-slate-800 border ${isAdmin ? 'border-slate-600 focus:border-violet-500' : 'border-slate-700 cursor-not-allowed'} text-white rounded-lg py-2.5 pl-8 pr-4 font-mono text-lg focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors`}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-slate-400 text-sm font-semibold mb-2">Yearly Wage (Auto)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-500 font-bold">₹</span>
                        <input 
                            type="text" 
                            value={components.totalYearly}
                            disabled
                            className="w-full bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg py-2.5 pl-8 pr-4 font-mono text-lg cursor-default"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Earnings */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-6 border-b border-slate-700 pb-2">Salary Components</h3>
                    
                    <div className="space-y-5">
                        <ComponentRow label="Basic Salary" value={components.basic} percent="50% of Wage" />
                        <ComponentRow label="House Rent Allowance (HRA)" value={components.hra} percent="50% of Basic" />
                        <ComponentRow label="Standard Allowance" value={components.standardAllowance} percent="Fixed" />
                        <ComponentRow label="Performance Bonus" value={components.performanceBonus} percent="8.33% of Basic" />
                        <ComponentRow label="Leave Travel Allowance" value={components.lta} percent="8.33% of Basic" />
                        <ComponentRow label="Fixed Allowance" value={components.fixedAllowance} percent="Balance" highlight />
                    </div>
                </div>

                {/* Deductions */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-6 border-b border-slate-700 pb-2">Contributions & Deductions</h3>
                    
                    <div className="space-y-5">
                        <ComponentRow label="Provident Fund (PF)" value={components.pf} percent="12% of Basic" isDeduction />
                        <ComponentRow label="Professional Tax" value={components.professionalTax} percent="Fixed" isDeduction />
                        
                        <div className="mt-8 pt-6 border-t border-slate-700/50">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-medium">Net Take Home (Approx)</span>
                                <span className="text-emerald-400 font-bold font-mono text-xl">
                                    ₹ {(monthlyWage - components.pf - components.professionalTax).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Component for Rows
const ComponentRow = ({ label, value, percent, highlight = false, isDeduction = false }) => (
    <div className="flex items-center justify-between group">
        <div className="max-w-[180px]">
            <p className="text-slate-300 font-medium text-sm">{label}</p>
            <p className="text-xs text-slate-500">{percent}</p>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-end">
            <div className={`w-32 text-right font-mono font-medium ${highlight ? 'text-violet-400' : isDeduction ? 'text-rose-400' : 'text-slate-200'}`}>
                {value}
            </div>
            <div className="w-12 text-right text-xs text-slate-500 border-l border-slate-700 pl-2">
                / m
            </div>
        </div>
    </div>
);

export default SalaryInfo;
