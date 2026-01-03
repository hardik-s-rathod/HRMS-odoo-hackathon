import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Search,
  Users,
  Clock,
  AlertCircle,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

const Attendance = () => {
  const { user, attendanceStatus } = useAuth();
  const isAdmin = user?.role === "admin";

  // State
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMonth, setViewMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const endpoint = isAdmin ? "/attendance/all" : "/attendance/me";
      const response = await api.get(endpoint);
      setLogs(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch attendance", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header / Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-violet-600" />
            Attendance History
          </h2>
          <button
            onClick={fetchAttendance}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {!isAdmin && (
          <div className="flex items-center gap-4">
            {(() => {
              const todayStr = new Date().toISOString().split("T")[0];
              const todayLog = logs.find((l) => l.date === todayStr);

              if (!todayLog) {
                return (
                  <button
                    onClick={async () => {
                      try {
                        await api.post("/attendance/check-in");
                        fetchAttendance();
                      } catch (e) {
                        console.error(e);
                        alert("Check-in failed");
                      }
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
                  >
                    <Clock className="h-5 w-5" /> Check In
                  </button>
                );
              } else if (!todayLog.check_out) {
                return (
                  <button
                    onClick={async () => {
                      try {
                        await api.post("/attendance/check-out");
                        fetchAttendance();
                      } catch (e) {
                        console.error(e);
                        alert("Check-out failed");
                      }
                    }}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-rose-500/20 flex items-center gap-2 transition-all"
                  >
                    <Clock className="h-5 w-5" /> Check Out
                  </button>
                );
              } else {
                return (
                  <span className="px-4 py-2 bg-slate-100 text-slate-500 font-bold rounded-lg border border-slate-200 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" /> Day Completed
                  </span>
                );
              }
            })()}
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Work Hours</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    Loading records...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {formatDate(log.date)}
                    </td>
                    <td className="px-6 py-4 font-mono text-emerald-600">
                      {formatTime(log.check_in)}
                    </td>
                    <td className="px-6 py-4 font-mono text-rose-600">
                      {formatTime(log.check_out)}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-800 font-bold">
                      {log.work_hours || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.status === "present"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
