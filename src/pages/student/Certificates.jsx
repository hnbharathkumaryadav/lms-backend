import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import apiClient from "../../services/apiClient";
import html2pdf from "html2pdf.js";

export default function Certificates() {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await apiClient.get("/certificates/my");
            setCertificates(response.data);
        } catch (error) {
            console.error("Error fetching certificates:", error);
        } finally {
            setLoading(false);
        }
    };

    const [selectedCert, setSelectedCert] = useState(null);

    const handleDownload = (cert) => {
        setSelectedCert(cert);

        // Use setTimeout to ensure the DOM is updated with selectedCert before capturing
        setTimeout(() => {
            const element = document.getElementById('certificate-template');
            if (!element) {
                console.error("Certificate template not found");
                return;
            }

            const opt = {
                margin: 0,
                filename: `Certificate_${cert.courseName.replace(/\s+/g, '_')}_${cert.studentName.replace(/\s+/g, '_')}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 3, // Increased scale for better quality
                    useCORS: true,
                    letterRendering: true,
                    logging: false,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
                pagebreak: { mode: 'avoid-all' }
            };

            // Generate the PDF
            html2pdf().set(opt).from(element).save()
                .then(() => {
                    console.log("PDF downloaded successfully");
                })
                .catch(err => {
                    console.error("PDF generation error:", err);
                });
        }, 300);
    };

    return (
        <StudentLayout>
            <div className="max-w-6xl mx-auto py-12 px-4 print:hidden">
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 p-12 text-center text-white relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-xl border border-white/30 transform hover:rotate-12 transition-transform">
                                📜
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">E-Certifications</h1>
                            <p className="text-blue-100 text-lg max-w-2xl mx-auto font-medium">
                                Validate your expertise. View and download your official course completion certificates.
                            </p>
                        </div>
                    </div>

                    <div className="p-8 lg:p-12">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-slate-500 font-medium">Retrieving your achievements...</p>
                            </div>
                        ) : certificates.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {certificates.map((cert) => (
                                    <div key={cert.id} className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-2xl hover:border-blue-200 transition-all duration-500">
                                        <div className="absolute top-0 right-0 p-6">
                                            <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100 uppercase tracking-wider">
                                                Verified
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-500">
                                                🎓
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                                                {cert.courseName}
                                            </h3>
                                            <p className="text-slate-500 text-sm flex items-center gap-2">
                                                <span>Issued to:</span>
                                                <span className="font-bold text-slate-700">{cert.studentName}</span>
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm border-t border-slate-50 pt-4">
                                                <span className="text-slate-400 font-medium">Issue Date</span>
                                                <span className="text-slate-700 font-bold">
                                                    {new Date(cert.issueDate).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm border-t border-slate-50 pt-4">
                                                <span className="text-slate-400 font-medium">Certificate Code</span>
                                                <code className="bg-slate-50 px-2 py-1 rounded text-blue-600 font-mono font-bold uppercase">
                                                    {cert.certificateCode}
                                                </code>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDownload(cert)}
                                            className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 group/btn active:scale-95 shadow-lg lg:opacity-0 lg:group-hover:opacity-100 duration-300">
                                            <span>Download PDF</span>
                                            <span className="group-hover/btn:translate-y-1 transition-transform">⬇️</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-[3rem] p-12 lg:p-20">
                                    <div className="text-8xl mb-8 transform hover:scale-110 transition-transform">🎓</div>
                                    <h2 className="text-3xl font-black text-slate-800 mb-4">Your certificate wall is empty</h2>
                                    <p className="text-slate-500 text-lg max-w-md mx-auto mb-10 leading-relaxed font-medium">
                                        Completion certificates are awarded automatically once you finish all lessons in a course. Start learning today!
                                    </p>
                                    <button
                                        onClick={() => navigate("/courses")}
                                        className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:shadow-blue-300 active:scale-95 text-lg"
                                    >
                                        Explore Courses
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hidden Template for PDF/Print */}
            <div className="fixed -left-[10000px] top-0">
                {/* Slightly reduced width/height to ensure 1-page fit on A4 Landscape */}
                <div id="certificate-template" className="w-[296mm] h-[209mm] bg-white p-[10mm] overflow-hidden box-border">
                    {selectedCert && (
                        <div className="relative border-[15px] border-double border-indigo-900 h-full p-12 flex flex-col items-center justify-between text-center overflow-hidden">
                            {/* Decorative Corner Ornaments */}
                            <div className="absolute top-4 left-4 w-24 h-24 border-t-4 border-l-4 border-indigo-700/20 rounded-tl-3xl"></div>
                            <div className="absolute top-4 right-4 w-24 h-24 border-t-4 border-r-4 border-indigo-700/20 rounded-tr-3xl"></div>
                            <div className="absolute bottom-4 left-4 w-24 h-24 border-b-4 border-l-4 border-indigo-700/20 rounded-bl-3xl"></div>
                            <div className="absolute bottom-4 right-4 w-24 h-24 border-b-4 border-r-4 border-indigo-700/20 rounded-br-3xl"></div>

                            {/* Background Branding */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                                <span className="text-[15rem] font-black rotate-[-35deg] tracking-widest">LEARNIX</span>
                            </div>

                            {/* Top Branding */}
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 bg-indigo-900 rounded-xl flex items-center justify-center mb-4 shadow-xl">
                                    <span className="text-white font-black text-2xl italic tracking-tighter">L</span>
                                </div>
                                <span className="text-indigo-900 font-bold tracking-widest text-sm uppercase mb-2">Academic Excellence</span>
                                <div className="w-40 h-[2px] bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
                            </div>

                            {/* Main Title Section */}
                            <div className="relative z-10">
                                <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">Certificate</h1>
                                <p className="text-xl text-slate-500 uppercase tracking-[0.5em] font-medium border-t border-b border-slate-100 py-2">Of Completion</p>
                            </div>

                            {/* Recipient Section */}
                            <div className="relative z-10 w-full max-w-2xl">
                                <p className="text-lg text-slate-400 italic mb-6">This is to officially certify that</p>
                                <h2 className="text-6xl text-indigo-950 mb-6 font-black tracking-tight drop-shadow-sm pb-2">
                                    {selectedCert.studentName}
                                </h2>
                                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6"></div>
                                <p className="text-lg text-slate-400 italic mb-4">has successfully met all the academic requirements for</p>
                                <h3 className="text-3xl font-black text-slate-800 leading-tight">
                                    {selectedCert.courseName}
                                </h3>
                            </div>

                            {/* Authentication Seal & Signatures */}
                            <div className="relative z-10 grid grid-cols-3 w-full max-w-4xl items-end gap-8 pb-8">
                                {/* Signature Left */}
                                <div className="text-center">
                                    <div className="mb-2 h-16 flex items-end justify-center">
                                        <span className="font-script text-3xl text-indigo-700 opacity-80 select-none">Learnix Academy</span>
                                    </div>
                                    <div className="h-[2px] bg-slate-200 w-full mb-2"></div>
                                    <p className="font-black text-xs text-slate-700 uppercase tracking-widest">Lead Instructor</p>
                                </div>

                                {/* Seal Center */}
                                <div className="flex justify-center relative -mb-4">
                                    <div className="w-32 h-32 rounded-full border-4 border-indigo-900 bg-indigo-50 flex items-center justify-center relative shadow-2xl">
                                        <div className="absolute inset-2 border-2 border-dashed border-indigo-300 rounded-full"></div>
                                        <div className="text-center relative z-10">
                                            <div className="text-xs font-black text-indigo-900 uppercase tracking-tighter leading-none mb-1">Official</div>
                                            <div className="text-lg font-black text-indigo-900">SEAL</div>
                                            <div className="text-[0.6rem] font-bold text-indigo-900/60 uppercase">Verified</div>
                                        </div>
                                        {/* Ribbons */}
                                        <div className="absolute -bottom-6 -left-2 w-8 h-12 bg-indigo-900 rounded-sm skew-x-[15deg] origin-top -z-10 shadow-lg"></div>
                                        <div className="absolute -bottom-6 -right-2 w-8 h-12 bg-indigo-800 rounded-sm -skew-x-[15deg] origin-top -z-10 shadow-lg"></div>
                                    </div>
                                </div>

                                {/* Signature Right */}
                                <div className="text-center">
                                    <div className="mb-2 h-16 flex items-end justify-center">
                                        <span className="font-mono text-xl text-slate-800 font-bold select-none italic">
                                            {new Date(selectedCert.issueDate).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="h-[2px] bg-slate-200 w-full mb-2"></div>
                                    <p className="font-black text-xs text-slate-700 uppercase tracking-widest">Date Issued</p>
                                </div>
                            </div>

                            {/* Footnote */}
                            <div className="relative z-10 w-full border-t border-slate-100 pt-6 px-12 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                                <span>LMS Verification ID: {selectedCert.certificateCode}</span>
                                <span>© {new Date().getFullYear()} LEARNIX GLOBAL EDUCATION</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
