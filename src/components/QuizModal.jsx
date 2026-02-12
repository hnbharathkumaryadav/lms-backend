import React, { useState } from "react";
import apiClient from "../services/apiClient";
import { toast } from "react-toastify";

export default function QuizModal({ quiz, isOpen, onClose, onPass }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    if (!isOpen || !quiz) return null;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const totalQuestions = quiz.questions.length;

    const handleOptionSelect = (optionIndex) => {
        setAnswers({
            ...answers,
            [currentQuestion.id]: optionIndex,
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < totalQuestions) {
            toast.warning("Please answer all questions before submitting.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiClient.post(`/quizzes/${quiz.id}/submit`, answers);
            setResult(response.data);
            if (response.data.passed) {
                toast.success("Congratulations! You passed the quiz.");
                if (onPass) onPass();
            } else {
                toast.error("You did not pass. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting quiz:", error);
            toast.error("Failed to submit quiz. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setResult(null);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center relative">
                    <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                        <span>🧠</span> Quiz Time
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                        Test your knowledge to complete this lesson
                    </p>
                    {!result && (
                        <div className="absolute top-6 right-6 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                            Question {currentQuestionIndex + 1} / {totalQuestions}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-8">
                    {!result ? (
                        <div className="space-y-6">
                            {totalQuestions === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-5xl mb-4">📝</div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Quiz is being prepared</h3>
                                    <p className="text-slate-500 mb-8">This quiz doesn't have any questions yet. You can complete the lesson manually.</p>
                                    <button
                                        onClick={onPass}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
                                    >
                                        Skip and Complete Lesson
                                    </button>
                                </div>
                            ) : !currentQuestion ? (
                                <div className="text-center py-12">
                                    <p className="text-slate-500">Loading question...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <h3 className="text-xl font-semibold text-slate-800 leading-tight">
                                            {currentQuestion.text}
                                        </h3>
                                    </div>

                                    <div className="grid gap-3">
                                        {currentQuestion.options?.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleOptionSelect(index)}
                                                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 group flex items-center gap-4 ${answers[currentQuestion.id] === index
                                                    ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-md shadow-blue-100"
                                                    : "border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-600"
                                                    }`}
                                            >
                                                <div
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${answers[currentQuestion.id] === index
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-200 group-hover:bg-blue-100 text-slate-500"
                                                        }`}
                                                >
                                                    {String.fromCharCode(65 + index)}
                                                </div>
                                                {option}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Navigation */}
                                    <div className="flex justify-between items-center pt-4">
                                        <button
                                            onClick={handlePrevious}
                                            disabled={currentQuestionIndex === 0}
                                            className="px-6 py-2 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-colors"
                                        >
                                            Previous
                                        </button>
                                        {currentQuestionIndex < totalQuestions - 1 ? (
                                            <button
                                                onClick={handleNext}
                                                className="px-8 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-all shadow-lg active:scale-95 font-medium"
                                            >
                                                Next
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                className="px-10 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 font-bold disabled:opacity-50"
                                            >
                                                {isSubmitting ? "Grading..." : "Submit Quiz"}
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6 py-4">
                            <div className="text-center">
                                <div
                                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl shadow-lg mb-4 ${result.passed
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-600"
                                        }`}
                                >
                                    {result.passed ? "🎉" : "❌"}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800">
                                    {result.passed ? "Well Done!" : "Not Quite There"}
                                </h3>
                                <p className="text-slate-500 mt-2">
                                    You scored <span className="font-bold text-slate-700">{result.score}%</span>.
                                    Min passing score is {quiz.passingScore}%.
                                </p>
                            </div>

                            <div className="max-h-[40vh] overflow-y-auto space-y-4 px-2">
                                <h4 className="font-bold text-slate-700 border-b pb-2">Review Your Answers</h4>
                                {result.results.map((item, idx) => (
                                    <div key={idx} className={`p-4 rounded-xl border-2 ${item.isCorrect ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                                        <p className="font-semibold text-slate-800 mb-2">{idx + 1}. {item.questionText}</p>
                                        <div className="grid grid-cols-1 gap-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-500 w-24">Your Answer:</span>
                                                <span className={item.isCorrect ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                                    {String.fromCharCode(65 + item.studentAnswer)}. {quiz.questions.find(q => String(q.id) === String(item.questionId))?.options?.[item.studentAnswer] || "Unknown"}
                                                </span>
                                            </div>
                                            {!item.isCorrect && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500 w-24">Correct Answer:</span>
                                                    <span className="text-green-600 font-bold">
                                                        {String.fromCharCode(65 + item.correctAnswer)}. {quiz.questions.find(q => String(q.id) === String(item.questionId))?.options?.[item.correctAnswer] || "Unknown"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 justify-center pt-4">
                                {result.passed ? (
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-100 hover:shadow-xl transition-all active:scale-95"
                                    >
                                        Continue to Next Lesson
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={resetQuiz}
                                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                                        >
                                            Try Again
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="px-6 py-3 text-slate-500 hover:text-slate-800 font-bold transition-all"
                                        >
                                            Review Material
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
