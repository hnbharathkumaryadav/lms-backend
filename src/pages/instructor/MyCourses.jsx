import React, { useState, useEffect } from "react";
import InstructorLayout from "../../layouts/InstructorLayout";
import { instructorService } from "../../services/instructorService";
import { getCurrentUser } from "../../services/authService";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const currentUser = getCurrentUser();
      const instructorId = currentUser.id || currentUser.userId || 1;
      const coursesData = await instructorService.getMyCourses(instructorId);
      setCourses(coursesData || []);
    } catch (error) {
      console.error("Error loading courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        await instructorService.deleteCourse(courseId);
        // Update local state to remove the deleted course
        setCourses(courses.filter((c) => c.id !== courseId));
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader size="lg" text="Loading your courses..." />
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              My Courses
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and view all your created courses
            </p>
          </div>
          <Link
            to="/instructor/courses/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first course
            </p>
            <Link
              to="/instructor/courses/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Course Cover Image */}
                <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
                  {course.coverImageUrl ? (
                    <img
                      src={course.coverImageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-50">
                      📚
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-bold text-white line-clamp-1">{course.title}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                    {course.description || "No description provided for this course."}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${course.approved
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                      }`}>
                      {course.approved ? "● Published" : "○ Pending Approval"}
                    </span>
                    <Link
                      to={`/instructor/courses/${course.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-bold transition-colors"
                    >
                      Manage
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete Course"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}