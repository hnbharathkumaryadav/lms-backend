import React from "react";
import StudentLayout from "../../layouts/StudentLayout";

export default function Assessments() {
    return (
        <StudentLayout>
            <div className="max-w-5xl mx-auto py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Interactive Assessments</h1>
                        <p className="text-gray-600">Review your past quiz performances and current standings.</p>
                    </div>
                    <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                        Total Quizzes: 0
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="bg-white p-12 rounded-3xl shadow-lg border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl">
                            📝
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Assessments Recorded</h2>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Your quiz attempts and results will appear here. Start a lesson with an integrated quiz to populate this history.
                        </p>
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-12 bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl border border-blue-100 flex items-center gap-6">
                    <div className="text-4xl">💡</div>
                    <div>
                        <h3 className="font-bold text-blue-900 text-lg">Did you know?</h3>
                        <p className="text-blue-700">
                            Interactive assessments are now integrated directly into your lessons. Listen carefully and watch to the end to trigger "Quiz Time"!
                        </p>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
