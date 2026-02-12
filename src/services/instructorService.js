import apiClient from "./apiClient";

export const instructorService = {
  //  COURSE MANAGEMENT - WITH ERROR HANDLING
  createCourse: async (courseData) => {
    try {
      const { data } = await apiClient.post("/instructor/courses", courseData);
      return data;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },

  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await apiClient.post("/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  // instructorService.js mein yeh add karo
  getEnrolledStudents: async (courseId) => {
    try {
      const { data } = await apiClient.get(
        `/instructor/courses/${courseId}/students`
      );
      return data;
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
      return []; // Return empty array on error
    }
  },

  getMyCourses: async (instructorId) => {
    try {
      const { data } = await apiClient.get(
        `/instructor/${instructorId}/courses`
      );
      return data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  getCourse: async (courseId) => {
    try {
      const { data } = await apiClient.get(`/instructor/courses/${courseId}`);
      return data;
    } catch (error) {
      console.error("Error fetching course:", error);
      throw error;
    }
  },

  //  LESSON MANAGEMENT - WITH ERROR HANDLING
  addLesson: async (courseId, lessonData) => {
    try {
      const { data } = await apiClient.post(
        `/lessons/course/${courseId}`, // Corrected: Use the dedicated LessonController endpoint
        lessonData
      );
      return data;
    } catch (error) {
      console.error("Error adding lesson:", error);
      throw error;
    }
  },

  getLesson: async (lessonId) => {
    try {
      const { data } = await apiClient.get(`/lessons/${lessonId}`);
      return data;
    } catch (error) {
      console.error("Error fetching lesson:", error);
      throw error;
    }
  },

  updateLesson: async (lessonId, lessonData) => {
    try {
      const { data } = await apiClient.put(`/lessons/${lessonId}`, lessonData);
      return data;
    } catch (error) {
      console.error("Error updating lesson:", error);
      throw error;
    }
  },

  getLessons: async (courseId) => {
    try {
      const { data } = await apiClient.get(
        `/lessons/course/${courseId}` // Corrected: Match LessonController endpoint
      );
      return data;
    } catch (error) {
      console.error("Error fetching lessons:", error);
      return []; // Return empty array instead of throwing
    }
  },

  deleteLesson: async (lessonId) => {
    try {
      const { data } = await apiClient.delete(
        `/instructor/lessons/${lessonId}`
      );
      return data;
    } catch (error) {
      console.error("Error deleting lesson:", error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const { data } = await apiClient.get("/categories");
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  deleteCourse: async (courseId) => {
    try {
      const { data } = await apiClient.delete(`/courses/${courseId}`);
      return data;
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  },
};

export default instructorService;
