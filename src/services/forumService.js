import apiClient from './apiClient';

const forumService = {
    getAllPosts: async () => {
        const response = await apiClient.get('/forum');
        return response.data;
    },

    createPost: async (content, userId, parentPostId = null) => {
        const response = await apiClient.post('/forum', {
            content,
            userId,
            parentPostId
        });
        return response.data;
    },

    deletePost: async (postId) => {
        await apiClient.delete(`/forum/${postId}`);
    },

    lockPost: async (postId, lock) => {
        const response = await apiClient.put(`/forum/${postId}/lock?lock=${lock}`);
        return response.data;
    }
};

export default forumService;
