import React, { useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import apiClient from "../../services/apiClient";
import { toast } from "react-toastify";

export default function Settings() {
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            await apiClient.post("/auth/change-password", {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            toast.success("Password updated successfully!");
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <StudentLayout>
            <div className="max-w-4xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Account Settings</h1>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span>🔒</span> Security
                        </h2>

                        <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-xl">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwords.currentPassword}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
