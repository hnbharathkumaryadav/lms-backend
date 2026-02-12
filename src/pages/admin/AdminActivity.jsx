import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import * as adminService from "../../services/adminService";

export default function AdminActivity() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                const data = await adminService.getRecentActivity();
                setActivities(data || []);
            } catch (err) {
                console.error("Error fetching activities:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Recent Activity
                    </h1>
                    <p className="text-gray-600 mt-2">
                        View all recent system activities and notifications
                    </p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : activities.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {activities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-lg">{activity.icon || "📢"}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-medium">
                                            {activity.message}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {activity.time || "Recently"}
                                        </p>
                                    </div>
                                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600 uppercase">
                                        {activity.type || "System"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No recent activity found</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
