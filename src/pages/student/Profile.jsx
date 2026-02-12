import React, { useState, useEffect } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import apiClient from "../../services/apiClient";
import { toast } from "react-toastify";

export default function Profile() {
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        role: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get("/users/profile");
            setProfile(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile details");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await apiClient.put("/users/profile", {
                username: profile.username,
                email: profile.email
            });

            // Update local storage too so UI remains in sync
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            localStorage.setItem("userData", JSON.stringify({
                ...userData,
                username: response.data.username,
                email: response.data.email
            }));

            setProfile(response.data);
            toast.success("Profile updated successfully! ✨");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <StudentLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout>
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-12 text-center text-white relative">
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="inline-block relative">
                                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-2xl backdrop-blur-md border-4 border-white/40 ring-4 ring-white/20">
                                    {profile.username?.charAt(0).toUpperCase() || "S"}
                                </div>
                                <div className="absolute bottom-6 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">{profile.username || "Student"}</h1>
                            <p className="text-blue-100 text-lg opacity-90 capitalize font-semibold tracking-wide flex items-center justify-center gap-2">
                                <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                                {typeof profile.role === 'object'
                                    ? profile.role?.name?.toLowerCase().replace("role_", "")
                                    : profile.role?.toLowerCase().replace("role_", "") || "Student"}
                            </p>
                        </div>
                    </div>

                    <div className="p-8 md:p-14">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Left Column: Form */}
                            <div className="lg:col-span-12 space-y-8">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                        <span className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">👤</span>
                                        Personal Information
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Full Name</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={profile.username}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-800"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1 uppercase tracking-wider">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-800"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 mt-8 flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className={`px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <span>💾</span> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Account Security Tip */}
                            <div className="lg:col-span-12">
                                <div className="p-8 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 rounded-[2rem] border border-blue-100/50 relative overflow-hidden group">
                                    <div className="absolute -right-8 -bottom-8 text-9xl opacity-[0.03] group-hover:scale-110 transition-transform duration-700">🛡️</div>
                                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                        <div className="p-5 bg-white rounded-2xl shadow-sm border border-blue-100 text-3xl">🔒</div>
                                        <div>
                                            <h3 className="font-bold text-indigo-950 text-xl mb-1">Account Security</h3>
                                            <p className="text-indigo-800/70 leading-relaxed max-w-xl">
                                                Your account is protected with standard JWT authentication. Your personal information is encrypted and stored securely.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
