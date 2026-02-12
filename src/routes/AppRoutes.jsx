import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import UserManagement from "../pages/admin/UserManagement";
import CourseApproval from "../pages/admin/CourseApproval";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminActivity from "../pages/admin/AdminActivity";
import InstructorDashboard from "../pages/instructor/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";
import CourseViewer from "../pages/student/CourseViewer";
import CourseCatalog from "../pages/student/CourseCatalog";
import MyLearning from "../pages/student/MyLearning";
import StudentLessonView from "../pages/student/StudentLessonView";
import Certificates from "../pages/student/Certificates";
import Assessments from "../pages/student/Assessments";
import Profile from "../pages/student/Profile";
import Settings from "../pages/student/Settings";
import CreateCourse from "../pages/instructor/CreateCourse";
import CourseDetail from "../pages/instructor/CourseDetail";
import AddLesson from "../pages/instructor/AddLesson";
import MyCourses from "../pages/instructor/MyCourses";
import EnrolledStudents from "../pages/instructor/EnrolledStudents";
import Forum from "../pages/common/Forum";


export default function AppRoutes() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("userRole"),
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setAuth({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("userRole"),
      });
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!auth.token) {
      return <Navigate to="/login" replace />;
    }
    const userRole = auth.role?.replace("ROLE_", "");
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (auth.token) {
      const userRole = auth.role?.replace("ROLE_", "");
      const dashboard = userRole === "ADMIN" ? "/admin/dashboard" : userRole === "INSTRUCTOR" ? "/instructor/dashboard" : "/student/dashboard";
      return <Navigate to={dashboard} replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* ADMIN */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["ADMIN"]}><UserManagement /></ProtectedRoute>} />
      <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={["ADMIN"]}><CourseApproval /></ProtectedRoute>} />
      <Route path="/admin/activities" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminActivity /></ProtectedRoute>} />
      <Route path="/admin/forum" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Forum /></ProtectedRoute>} />


      {/* INSTRUCTOR */}
      <Route path="/instructor/dashboard" element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]}><InstructorDashboard /></ProtectedRoute>} />
      <Route path="/instructor/courses" element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]}><MyCourses /></ProtectedRoute>} />
      <Route path="/instructor/courses/new" element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]}><CreateCourse /></ProtectedRoute>} />

      <Route path="/instructor/courses/:id" element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]}><CourseDetail /></ProtectedRoute>} />
      <Route path="/instructor/courses/:id/lessons/new" element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]}><AddLesson /></ProtectedRoute>} />
      <Route path="/instructor/courses/:id/students" element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]}><EnrolledStudents /></ProtectedRoute>} />
      <Route path="/instructor/lessons/:lessonId/edit" element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]}><AddLesson /></ProtectedRoute>} />
      <Route path="/instructor/forum" element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]}><Forum /></ProtectedRoute>} />

      {/* STUDENT */}
      <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute allowedRoles={["STUDENT"]}><CourseCatalog /></ProtectedRoute>} />
      <Route path="/student/learning" element={<ProtectedRoute allowedRoles={["STUDENT"]}><MyLearning /></ProtectedRoute>} />

      <Route path="/student/course/:id" element={<ProtectedRoute allowedRoles={["STUDENT"]}><CourseViewer /></ProtectedRoute>} />
      <Route path="/student/certificates" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Certificates /></ProtectedRoute>} />
      <Route path="/student/assessments" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Assessments /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Profile /></ProtectedRoute>} />
      <Route path="/student/settings" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Settings /></ProtectedRoute>} />
      <Route path="/student/lessons/:lessonId" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentLessonView /></ProtectedRoute>} />
      <Route path="/student/forum" element={<ProtectedRoute allowedRoles={["STUDENT"]}><Forum /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
