import React, { useState } from "react";
import InstructorLayout from "../../layouts/InstructorLayout";
import { instructorService } from "../../services/instructorService";
import { getCurrentUser } from "../../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreateCourse() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImageUrl: "",
    categoryId: "", // Use categoryId instead of category string
    level: "BEGINNER",
    duration: 0,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Fetch categories on mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await instructorService.getCategories();
        setCategories(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    const instructorId = currentUser.id || currentUser.userId;
    if (!instructorId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const courseData = {
        ...formData,
        instructorId: instructorId, // Use actual instructor ID
        price: 0, // Set price to 0 by default
        categoryId: parseInt(formData.categoryId),
        approved: false,
      };

      await instructorService.createCourse(courseData);

      toast.success("Course created successfully! Waiting for admin approval.");
      navigate("/instructor/dashboard");
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <InstructorLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Course
            </h1>
            <p className="text-gray-600 mt-2">
              Fill in the details to create your new course
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter course title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your course in detail..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>

              <div className="flex items-center gap-4">
                {/* Preview */}
                {formData.coverImageUrl && (
                  <div className="w-32 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={formData.coverImageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <input
                    type="file"
                    id="coverImageUpload"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      try {
                        setLoading(true);
                        const response = await instructorService.uploadMedia(file);
                        setFormData(prev => ({ ...prev, coverImageUrl: response.fileUrl }));
                        toast.success("Image uploaded successfully!");
                      } catch (err) {
                        toast.error("Failed to upload image");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a cover image (JPG, PNG). Max size 5MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Course...
                  </span>
                ) : (
                  "Create Course"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/instructor/dashboard")}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </InstructorLayout>
  );
}
