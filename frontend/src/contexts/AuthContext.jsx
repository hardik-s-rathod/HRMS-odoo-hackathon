import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceStatus, setAttendanceStatus] = useState('checked-out');

    // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await api.get('/auth/me');
                // The user object is nested in response.data.data
                setUser(response.data.data);
                
            } catch (error) {
                console.error("Auth check failed", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        // Token and user are nested in response.data.data
        const { token, user } = response.data.data;
        
        localStorage.setItem('token', token);
        setUser(user);
        return { success: true };
    } catch (error) {
        console.error("Login failed", error);
        return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
      try {
          const response = await api.post('/auth/register', userData);
           // Register usually just returns success, or maybe token if auto-login
          return { success: true };
      } catch (error) {
          console.error("Registration failed", error);
          return { success: false, message: error.response?.data?.message || 'Registration failed' };
      }
  };

  const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch(e) {
        console.error("Logout error", e);
    } finally {
        localStorage.removeItem('token');
        setUser(null);
        setAttendanceStatus('checked-out');
    }
  };

  const toggleAttendance = async () => {
      // Implement API call for check-in/out
      try {
          if (attendanceStatus === 'checked-in') {
              await api.post('/attendance/check-out');
              setAttendanceStatus('checked-out');
          } else {
              await api.post('/attendance/check-in');
              setAttendanceStatus('checked-in');
          }
      } catch (error) {
          console.error("Attendance toggle failed", error);
          alert("Failed to update attendance");
      }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, attendanceStatus, toggleAttendance }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
