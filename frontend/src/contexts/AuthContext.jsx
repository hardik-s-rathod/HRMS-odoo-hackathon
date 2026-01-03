import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('checked-out'); // 'checked-in', 'checked-out'

  const login = (role = 'employee') => {
    // Mock users for demonstration
    if (role === 'admin') {
        setUser({ 
            name: 'Admin User', 
            role: 'admin', 
            email: 'admin@company.com',
            details: { designation: 'HR Manager', department: 'Human Resources' }
        });
    } else {
        setUser({ 
            name: 'John Employee', 
            role: 'employee', 
            email: 'employee@company.com', 
            details: { designation: 'Software Engineer', department: 'Engineering' }
        });
    }
  };

  const logout = () => {
    setUser(null);
    setAttendanceStatus('checked-out');
  };

  const toggleAttendance = () => {
      setAttendanceStatus(prev => prev === 'checked-in' ? 'checked-out' : 'checked-in');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, attendanceStatus, toggleAttendance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
