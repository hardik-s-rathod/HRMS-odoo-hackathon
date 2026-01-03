import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Shield,
  UserCheck,
  Copy,
  Loader,
  Edit2,
  Trash2,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

const Employees = () => {
  const { register } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    joinDate: "",
    email: "",
    phone: "",
    password: "",
    designation: "Employee",
    department: "General",
    salary: "",
  });

  const [generatedCreds, setGeneratedCreds] = useState(null);

  // Fetch Employees on Mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      // setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const generateId = () => {
    if (!formData.firstName || !formData.lastName) return;

    const companyCode = "OI";
    const nameCode = (
      formData.firstName.slice(0, 2) + formData.lastName.slice(0, 2)
    ).toUpperCase();
    const year = new Date().getFullYear();
    const serial = String(employees.length + 1).padStart(4, "0");

    const newId = `${companyCode}${nameCode}${year}${serial}`;
    // Auto-generate password
    const password = Math.random().toString(36).slice(-8);

    setGeneratedCreds({ id: newId, password });
    setFormData((prev) => ({ ...prev, password: password }));
  };

  const [editingEmployee, setEditingEmployee] = useState(null);

  // ... existing verify logic ...

  // Handle Edit Click
  const handleEditClick = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      firstName: emp.user?.name.split(" ")[0] || "",
      lastName: emp.user?.name.split(" ")[1] || "",
      email: emp.user?.email || "",
      phone: emp.user?.phone_number || "", // Assuming phone is available
      joinDate: emp.joining_date || "",
      designation: emp.designation || "",
      department: emp.department || "",
      salary: emp.salary || "",
      password: "", // Don't fill password on edit
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this employee? This action cannot be undone."
      )
    ) {
      try {
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter((e) => e.id !== id));
      } catch (err) {
        console.error("Failed to delete", err);
        alert("Failed to delete employee");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingEmployee) {
        // Update Logic
        const payload = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          designation: formData.designation,
          department: formData.department,
          joining_date: formData.joinDate,
          salary: formData.salary,
          // Only send password if changed, backend logic needed?
          // For now, let's assume password update is separate or ignored here
        };

        await api.put(`/employees/${editingEmployee.id}`, payload);
        fetchEmployees();
        setShowModal(false);
        setEditingEmployee(null);
      } else {
        // Add Logic
        if (!generatedCreds) {
          generateId();
          return;
        }

        // Use api.post('/employees') instead of register
        // EmployeeController handles both User and Employee creation
        await api.post("/employees", {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password,
          designation: formData.designation,
          department: formData.department,
          joining_date: formData.joinDate,
          joining_date: formData.joinDate,
          salary: formData.salary || 0,
          address: "Remote", // Default for now
          role: "employee",
        });

        setShowModal(false);
        fetchEmployees();
        setGeneratedCreds(null);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to ${editingEmployee ? "update" : "create"} employee.`);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      joinDate: "",
      email: "",
      phone: "",
      password: "",
      designation: "Employee",
      department: "General",
    });
    setGeneratedCreds(null);
    setEditingEmployee(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Employees</h2>
          <p className="text-slate-500 mt-1">Manage system users and access</p>
        </div>
        {/* Only show Add button if Admin */}
        {/* Assuming current user check logic is available via useAuth user object */}
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-violet-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="h-5 w-5" />
          Add Employee
        </button>
      </div>

      {/* ... Table ... */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* ... existing search ... */}
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

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center">
            <Loader className="h-8 w-8 animate-spin mb-2" />
            <p>Loading employees...</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joining Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xs">
                        {emp.user?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {emp.user?.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {emp.designation || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">
                    {emp.user?.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        emp.user?.role === "admin"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {emp.user?.role === "admin" && (
                        <Shield className="h-3 w-3" />
                      )}
                      {emp.user?.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{emp.joining_date || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEditClick(emp)}
                        className="flex items-center gap-1 text-slate-500 hover:text-violet-600 transition-colors font-medium"
                        title="Edit Employee"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(emp.id)}
                        className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors font-medium"
                        title="Delete Employee"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-[fadeIn_0.2s_ease-out] overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h3>
              <p className="text-slate-500 text-sm">
                {editingEmployee
                  ? "Update details below"
                  : "System will auto-generate Login Credentials"}
              </p>
            </div>

            <div className="p-8 grid grid-cols-1 gap-8">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {error && (
                  <div className="text-rose-600 text-sm bg-rose-50 p-2 rounded">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      First Name
                    </label>
                    <input
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      type="text"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Last Name
                    </label>
                    <input
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      type="text"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designation: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Joining Date
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) =>
                      setFormData({ ...formData, joinDate: e.target.value })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Salary
                  </label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  {editingEmployee ? (
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 shadow-lg shadow-violet-500/20"
                    >
                      Update Employee
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={generateId}
                      className="flex-1 py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700"
                    >
                      Generate ID
                    </button>
                  )}
                </div>
              </form>

              {!editingEmployee && (
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-center">
                  {/* ... Previous preview code ... */}
                  {generatedCreds ? (
                    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                      {/* ... */}
                      <button
                        onClick={handleFormSubmit}
                        className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 mt-2"
                      >
                        Confirm & Create User
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 py-8">
                      <UserCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        Fill details and click "Generate ID" to preview.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
