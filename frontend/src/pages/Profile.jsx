import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  User,
  Edit2,
  Plus,
} from "lucide-react";
import SalaryInfo from "../components/SalaryInfo";

const Profile = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState("resume");

  // Mock Profile Data
  // Real Profile Data from Backend
  const emp = user?.employee || {};
  const profile = {
    name: user?.name || "Unknown User",
    designation: emp.designation || "Employee",
    email: user?.email || "",
    phone: user?.phone || "Not Provided",
    location: emp.address || "Remote",
    about: "No bio available.",
    skills: ["Employee"], // Mock skills as backend table doesn't have them yet
    certifications: [],
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    phone: profile.phone,
    address: profile.location,
  });

  // Sync editData when user loads
  React.useEffect(() => {
    setEditData({
      phone: user?.phone_number || "",
      address: user?.employee?.address || "",
    });
  }, [user]);

  const handleSave = async () => {
    try {
      await api.put("/auth/profile", {
        phone_number: editData.phone,
        address: editData.address,
      });
      setIsEditing(false);
      // Reload user data to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Profile update failed", error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Dark Profile Header Card */}
      <div className="bg-[#1e293b] text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
          {/* Avatar */}
          <div className="relative group">
            <div className="h-32 w-32 rounded-full bg-slate-700 border-4 border-slate-600 flex items-center justify-center text-4xl font-bold shadow-2xl">
              {profile.name.charAt(0)}
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 bg-violet-600 p-2 rounded-full shadow-lg hover:bg-violet-500 transition-colors"
              >
                <Edit2 className="h-4 w-4 text-white" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full shadow-lg hover:bg-emerald-400 transition-colors"
              >
                <Save className="h-4 w-4 text-white" />
              </button>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-violet-400 font-medium text-lg mt-1">
                  {profile.designation}
                </p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    isAdmin
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/50"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                  }`}
                >
                  {isAdmin ? "Administrator" : "Employee"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-1.5 rounded">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-1.5 rounded">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                {isEditing ? (
                  <input
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData({ ...editData, phone: e.target.value })
                    }
                    className="bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white focus:outline-none focus:border-violet-500 w-full"
                    placeholder="Phone Number"
                  />
                ) : (
                  <span>{profile.phone}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-1.5 rounded">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                {isEditing ? (
                  <input
                    value={editData.address}
                    onChange={(e) =>
                      setEditData({ ...editData, address: e.target.value })
                    }
                    className="bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white focus:outline-none focus:border-violet-500 w-full"
                    placeholder="Address"
                  />
                ) : (
                  <span>{profile.location}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-1.5 rounded">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                </div>
                <span>Engineering Dept</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-8 mt-12 border-b border-slate-600">
          {["Resume", "Private Info", "Salary Info"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition-all relative ${
                activeTab === tab.toLowerCase()
                  ? "text-white border-b-2 border-violet-500"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div
        className={`rounded-2xl p-8 border shadow-sm transition-all ${
          activeTab === "salary info"
            ? "bg-[#1e293b] border-slate-700"
            : "bg-white border-slate-200"
        }`}
      >
        {/* RESUME TAB */}
        {activeTab === "resume" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">About</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {profile.about}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Work Experience
                </h3>
                {/* Placeholder Timeline */}
                <div className="space-y-6 border-l-2 border-slate-100 pl-4 ml-2">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet-500 border-2 border-white"></div>
                    <h4 className="font-bold text-slate-800">
                      Senior Software Engineer
                    </h4>
                    <p className="text-xs text-slate-400 mb-1">
                      2021 - Present
                    </p>
                    <p className="text-sm text-slate-600">
                      Leading the frontend team...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Skills</h3>
                  <button className="text-violet-600 hover:bg-violet-100 p-1 rounded transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Certifications</h3>
                  <button className="text-violet-600 hover:bg-violet-100 p-1 rounded transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <ul className="space-y-3">
                  {profile.certifications.map((cert) => (
                    <li
                      key={cert}
                      className="text-sm text-slate-600 flex items-start gap-2"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0"></div>
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* PRIVATE INFO TAB (Placeholder) */}
        {activeTab === "private info" && (
          <div className="text-center py-12 text-slate-500">
            <User className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Private personal details would go here.</p>
          </div>
        )}

        {/* SALARY INFO TAB */}
        {activeTab === "salary info" && (
          <SalaryInfo isAdmin={isAdmin} salary={emp.salary || 0} />
        )}
      </div>
    </div>
  );
};

export default Profile;
