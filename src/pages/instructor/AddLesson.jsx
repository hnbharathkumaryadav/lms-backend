import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InstructorLayout from "../../layouts/InstructorLayout";
import { instructorService } from "../../services/instructorService";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

export default function AddLesson() {
  const { id, lessonId } = useParams(); // 'id' is courseId, 'lessonId' is for edit mode
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mediaUrl: "",
    position: 1,
    durationSeconds: 0,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const isEditMode = !!lessonId;

  const loadLessonData = useCallback(async () => {
    try {
      setFetching(true);
      const data = await instructorService.getLesson(lessonId);
      setFormData({
        ...data,
        durationSeconds: Math.floor(data.durationSeconds / 60), // Convert to minutes for UI
      });
    } catch (error) {
      console.error("Error loading lesson:", error);
      toast.error("Failed to load lesson data");
    } finally {
      setFetching(false);
    }
  }, [lessonId]);

  useEffect(() => {
    if (isEditMode) {
      loadLessonData();
    }
  }, [isEditMode, loadLessonData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const lessonData = {
        ...formData,
        durationSeconds: parseInt(formData.durationSeconds) * 60, // Convert minutes to seconds for API
      };

      if (isEditMode) {
        await instructorService.updateLesson(lessonId, lessonData);
        toast.success("Lesson updated successfully!");
      } else {
        await instructorService.addLesson(id, lessonData);
        toast.success("Lesson added successfully!");
      }

      // If we don't have courseId (id) in edit mode, we might need a fallback
      const backPath = id ? `/instructor/courses/${id}` : "/instructor/dashboard";
      navigate(backPath);
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast.error(`Failed to ${isEditMode ? "update" : "add"} lesson. Please try again.`);
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

  if (fetching) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader size="lg" text="Loading lesson data..." />
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Lesson" : "Add New Lesson"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditMode ? "Update the lesson details" : "Create a new lesson for your course"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter lesson title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter lesson content or description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="number"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="durationSeconds"
                  value={formData.durationSeconds}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media URL (YouTube/Video/PDF)
              </label>
              <input
                type="url"
                name="mediaUrl"
                value={formData.mediaUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500 mt-2">
                <strong>Tip:</strong> Paste a YouTube link, or a direct link to a video, audio, or PDF file.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Lesson" : "Add Lesson")}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
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
