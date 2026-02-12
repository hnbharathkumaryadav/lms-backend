import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import { toast } from "react-toastify";

export default function QuizManager({ lessonId, onClose }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [quiz, setQuiz] = useState({
        passingScore: 70,
        questions: [],
    });

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await apiClient.get(`/quizzes/lesson/${lessonId}`);
                if (response.data) {
                    setQuiz(response.data);
                }
            } catch (error) {
                if (error.response?.status !== 404) {
                    console.error("Error fetching quiz:", error);
                    toast.error("Failed to load quiz data");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [lessonId]);

    const handleAddQuestion = () => {
        const newQuestion = {
            text: "",
            options: ["", "", "", ""],
            correctOptionIndex: 0,
        };
        setQuiz({
            ...quiz,
            questions: [...quiz.questions, newQuestion],
        });
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = quiz.questions.filter((_, i) => i !== index);
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[index][field] = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleSave = async () => {
        // Validation
        if (quiz.questions.length === 0) {
            toast.warning("Please add at least one question.");
            return;
        }

        for (const q of quiz.questions) {
            if (!q.text.trim()) {
                toast.warning("All questions must have text.");
                return;
            }
            if (q.options.some((opt) => !opt.trim())) {
                toast.warning("All options must have text.");
                return;
            }
        }

        setSaving(true);
        try {
            const quizToSave = {
                ...quiz,
                passingScore: parseInt(quiz.passingScore) || 70
            };
            await apiClient.post(`/quizzes/lesson/${lessonId}`, quizToSave);
            toast.success("Quiz saved successfully!");
            if (onClose) onClose();
        } catch (error) {
            console.error("Error saving quiz:", error);
            toast.error("Failed to save quiz");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span>🧠</span> Lesson Assessment Manager
                    </h2>
                    <p className="text-indigo-100 text-sm">Create and manage multiple-choice quizzes</p>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                    ✕
                </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
                {/* Settings */}
                <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Passing Score (%)</label>
                        <p className="text-xs text-slate-500">Minimum score required to pass</p>
                    </div>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={quiz.passingScore}
                        onChange={(e) => setQuiz({ ...quiz, passingScore: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                        className="w-24 p-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none text-center font-bold"
                    />
                </div>

                {/* Questions List */}
                <div className="space-y-8">
                    {quiz.questions.map((q, qIndex) => (
                        <div key={qIndex} className="p-6 rounded-2xl border-2 border-slate-100 relative group hover:border-blue-100 transition-colors">
                            <button
                                onClick={() => handleRemoveQuestion(qIndex)}
                                className="absolute -top-3 -right-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 shadow-sm transition-all"
                            >
                                ✕
                            </button>

                            <div className="mb-4">
                                <label className="block text-sm font-bold text-slate-600 mb-2">Question {qIndex + 1}</label>
                                <textarea
                                    value={q.text}
                                    onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
                                    placeholder="Enter your question here..."
                                    className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all resize-none min-h-[100px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="relative">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleQuestionChange(qIndex, "correctOptionIndex", oIndex)}
                                                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${q.correctOptionIndex === oIndex
                                                    ? "border-green-500 bg-green-500 text-white"
                                                    : "border-slate-300 hover:border-blue-400"
                                                    }`}
                                            >
                                                {q.correctOptionIndex === oIndex && "✓"}
                                            </button>
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                placeholder={`Option ${oIndex + 1}`}
                                                className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-xs text-slate-400 italic">
                                Tip: Click the circle next to an option to mark it as the correct answer.
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State / Add Button */}
                <button
                    onClick={handleAddQuestion}
                    className="w-full mt-8 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                    <span>➕</span> Add New Question
                </button>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button
                    onClick={onClose}
                    className="px-6 py-3 text-slate-500 font-bold hover:text-slate-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                >
                    {saving ? "Saving Changes..." : "Save Assessment"}
                </button>
            </div>
        </div>
    );
}
