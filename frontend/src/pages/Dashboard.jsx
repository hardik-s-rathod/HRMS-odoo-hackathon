import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  X,
  Briefcase,
  Users,
  Clock,
  Calendar as CalendarIcon,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Edit2,
  Save,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOptions: 0, pendingLeaves: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        // Fetch employees list only for admins
        const empRes = await api.get("/employees");
        const apiEmployees = empRes.data.data || [];

        // Map API data to UI structure
        const formattedEmployees = apiEmployees.map((emp) => ({
          id: emp.id,
          name: emp.user?.name || "Unknown",
          role: emp.designation || emp.user?.role || "Employee",
          dept: emp.department || "N/A",
          email: emp.user?.email || "",
          phone: emp.user?.phone_number || "", // Assuming phone is on user or employee profile
          location: emp.address || "Remote",
          status: "present", // Mock status for now until attendance is linked
          img: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            emp.user?.name || "U"
          )}&background=random`,
        }));

        setEmployees(formattedEmployees);

        setStats({
          totalOptions: formattedEmployees.length,
          pendingLeaves: 0,
        });
      } else {
        // Employee Dashboard: Quick Cards
        setEmployees([
          {
            id: "profile",
            name: "My Profile",
            role: "View Personal Details",
            img: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "Me"
            )}`,
            link: "/profile",
            icon: Users,
          },
          {
            id: "attendance",
            name: "Attendance",
            role: "Check In/Out",
            img: `https://ui-avatars.com/api/?name=Att&background=random`,
            link: "/attendance",
            icon: Clock,
          },
          {
            id: "leaves",
            name: "Leave Requests",
            role: "Apply for Leave",
            img: `https://ui-avatars.com/api/?name=L&background=random`,
            link: "/leaves",
            icon: CalendarIcon,
          },
        ]);
      }
    } catch (error) {
      console.error("Dashboard fetch error", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return (
          <div
            className="h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm"
            title="Present"
          ></div>
        );
      case "leave":
        return (
          <div className="text-xs" title="On Leave">
            ✈️
          </div>
        );
      case "absent":
        return (
          <div
            className="h-3 w-3 rounded-full bg-amber-500 border-2 border-white shadow-sm"
            title="Absent"
          ></div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-violet-500/20 transition-all text-sm uppercase tracking-wide">
              New
            </button>
          )}
          {isAdmin && (
            <span className="text-slate-400 font-light text-2xl hidden sm:block">
              |
            </span>
          )}
          <h1 className="text-xl font-bold text-slate-700">Employees</h1>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          />
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            onClick={() =>
              emp.link
                ? (window.location.href = emp.link)
                : setSelectedEmployee(emp)
            }
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-violet-200 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img
                  src={emp.img}
                  alt={emp.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-slate-50 shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-0 right-0 -mr-1 -mt-1 bg-white rounded-full p-1 shadow-sm">
                  {getStatusIcon(emp.status)}
                </div>
              </div>

              <h3 className="font-bold text-slate-800 text-lg mb-1">
                {emp.name}
              </h3>
              <p className="text-violet-600 text-sm font-medium mb-3">
                {emp.role}
              </p>

              <div className="w-full border-t border-slate-100 pt-3 mt-1 flex justify-center gap-4 text-slate-400">
                <Mail className="h-4 w-4 hover:text-violet-500 transition-colors" />
                <Phone className="h-4 w-4 hover:text-violet-500 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View-Only Modal */}
      {selectedEmployee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setSelectedEmployee(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-[fadeIn_0.2s_ease-out] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-32 bg-gradient-to-r from-violet-600 to-indigo-600">
              <div className="absolute top-4 right-4 flex gap-2">
                {isAdmin && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                    title="Edit Details"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                )}
                {isEditing && (
                  <button
                    onClick={async () => {
                      try {
                        // Update logic here
                        await api.put(`/employees/${selectedEmployee.id}`, {
                          name: selectedEmployee.name,
                          email: selectedEmployee.email,
                          designation: selectedEmployee.role,
                          department: selectedEmployee.dept,
                          address: selectedEmployee.location,
                          phone_number: selectedEmployee.phone,
                        });
                        setIsEditing(false);
                        fetchDashboardData();
                      } catch (e) {
                        console.error("Update failed", e);
                        alert("Failed to update employee");
                      }
                    }}
                    className="bg-emerald-500/80 hover:bg-emerald-500 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                    title="Save Changes"
                  >
                    <Save className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedEmployee(null);
                    setIsEditing(false);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-6">
                <img
                  src={selectedEmployee.img}
                  alt={selectedEmployee.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                />
                <div
                  className="absolute bottom-1 right-[35%] bg-white rounded-full p-1.5 shadow-md"
                  title="Current Status"
                >
                  {getStatusIcon(selectedEmployee.status)}
                </div>
              </div>

              <div className="text-center mb-8">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      value={selectedEmployee.name}
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          name: e.target.value,
                        })
                      }
                      className="text-2xl font-bold text-slate-800 text-center w-full border-b border-violet-200 focus:outline-none focus:border-violet-500 bg-transparent"
                      placeholder="Full Name"
                    />
                    <input
                      value={selectedEmployee.role}
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          role: e.target.value,
                        })
                      }
                      className="text-violet-600 font-medium text-center w-full border-b border-violet-200 focus:outline-none focus:border-violet-500 bg-transparent"
                      placeholder="Designation"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {selectedEmployee.name}
                    </h2>
                    <p className="text-violet-600 font-medium">
                      {selectedEmployee.role}
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-white rounded-lg text-violet-600 shadow-sm">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">
                      Department
                    </p>
                    <p className="font-semibold text-slate-700">
                      {selectedEmployee.dept}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-white rounded-lg text-violet-600 shadow-sm">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">
                      Email Address
                    </p>
                    <p className="font-semibold text-slate-700">
                      {selectedEmployee.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-white rounded-lg text-violet-600 shadow-sm">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">
                      Phone Number
                    </p>
                    <p className="font-semibold text-slate-700">
                      {selectedEmployee.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-white rounded-lg text-violet-600 shadow-sm">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">
                      Location
                    </p>
                    <p className="font-semibold text-slate-700">
                      {selectedEmployee.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
