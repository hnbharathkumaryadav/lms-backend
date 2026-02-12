import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCurrentUser } from "../services/authService";
import Loader from "../components/Loader";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#featured-courses") {
      setTimeout(() => {
        const element = document.getElementById("featured-courses");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  // Dummy courses data
  useEffect(() => {
    const loadDummyCourses = () => {
      try {
        setLoading(true);

        const dummyCourses = [
          {
            id: 1,
            title: "Java Full Stack Development",
            category: "Full Stack",
            approved: true,
            coverImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
            description: "Master Java, Spring Boot, React, and MongoDB to become a full-stack developer.",
            level: "Advanced",
          },
          {
            id: 2,
            title: "Git & GitHub Masterclass",
            category: "Development Tools",
            approved: true,
            coverImageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=250&fit=crop",
            description: "Complete guide to version control with Git and collaboration with GitHub.",
            level: "Beginner",
          },
          {
            id: 3,
            title: "MERN Stack Development",
            category: "Full Stack",
            approved: true,
            coverImageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
            description: "Build modern web applications with MongoDB, Express.js, React, and Node.js.",
            level: "Intermediate",
          },
          {
            id: 4,
            title: "Python Data Science",
            category: "Data Science",
            approved: true,
            coverImageUrl: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=250&fit=crop",
            description: "Learn data analysis, machine learning, and visualization with Python.",
            level: "Intermediate",
          },
          {
            id: 5,
            title: "React Native Mobile Development",
            category: "Mobile Development",
            approved: true,
            coverImageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
            description: "Build cross-platform mobile apps for iOS and Android using React Native.",
            level: "Intermediate",
          },
          {
            id: 6,
            title: "AWS Cloud Practitioner",
            category: "Cloud Computing",
            approved: true,
            coverImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
            description: "Master AWS fundamentals and prepare for certification.",
            level: "Beginner",
          },
        ];

        setCourses(dummyCourses);
        setFeaturedCourses(dummyCourses.slice(0, 6));
      } catch (error) {
        console.error("Error loading courses:", error);
        setCourses([]);
        setFeaturedCourses([]);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      loadDummyCourses();
    }, 1000);
  }, []);

  const handleEnrollClick = (courseId) => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      navigate(`/student/course/${courseId}`);
    } else {
      navigate("/login");
    }
  };

  const handleViewDetails = (courseId) => {
    navigate("/courses");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  const currentUser = getCurrentUser();

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Basic Hero Section - Clean & Minimal */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        {/* Minimal Floating Icons Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle floating elements */}
          <div className="absolute top-10 left-10 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>📚</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '4s' }}>🎓</div>
          <div className="absolute bottom-20 left-1/4 text-3xl opacity-20 animate-pulse">💡</div>
          <div className="absolute bottom-10 right-1/4 text-3xl opacity-20 animate-pulse">💻</div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-4 py-1.5 rounded-full">
              Join 15,000+ Learners
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Learn Skills for Your <br />
            <span className="text-blue-600">Future Career</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Access high-quality courses, expert instructors, and a supportive community.
            Start your learning journey today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentUser ? (
              <Link
                to="/courses"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Browse Courses
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            )}
            <Link
              to="#featured-courses"
              className="px-8 py-3 rounded-lg font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses Section - Classic Basic Layout */}
      <section
        id="featured-courses"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-gray-600">
              Explore our most popular courses and start learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewDetails(course.id)}
              >
                {/* Course Image */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img
                    src={course.coverImageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x250?text=Course+Image";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 px-3 py-1 rounded text-xs font-bold text-gray-800">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                        course.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                      }`}>
                      {course.level}
                    </span>
                    <button className="text-blue-600 text-sm font-semibold hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
            >
              View All Courses &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Stats */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "15k+", label: "Students" },
              { number: "500+", label: "Courses" },
              { number: "50+", label: "Instructors" },
              { number: "4.8", label: "Rating" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-500 text-sm uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
