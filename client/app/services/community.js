import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://myapp.loca.lt/api/community";


/**
 * Create a new community post.
 * 
 * 
 *   {
 *     heading,
        heading_name,
        description,
        labels,
        createdBy
 *   }
 
 */
export const createCommunityPost = async (postData) => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.post(`${BASE_URL}/`, postData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to create post" };
    }
};

/**
 * Get all community posts.
 * 
 *
 */
export const getCommunityPosts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to fetch posts" };
    }
};

/**
 * Get community posts by heading_name.
 
 */
export const getPostsByHeading = async (headingName) => {
    try {
        const response = await axios.get(`${BASE_URL}/heading/${headingName}`);
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || `No posts found for heading ${headingName}` };
    }
};

/**
 * Add a comment to a community post.
 * 
 * 🔹 *Required Fields*:
 *   {
 *     comment: "Your comment here"
 *   }
 * 

 */
export const addComment = async (postId, commentData) => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.post(`${BASE_URL}/${postId}/comments`, commentData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to add comment" };
    }
};

/**
 * Like a community post.
 
 */
export const likePost = async (postId) => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.post(`${BASE_URL}/${postId}/like`, {}, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to like post" };
    }
};

/**
 * Delete a comment from a post.
 * 
 * @param {string} postId - ID of the post
 * @param {string} commentId - ID of the comment to delete
 * @returns {Object} - Success message or error message
 */
export const deleteComment = async (postId, commentId) => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.delete(`${BASE_URL}/${postId}/comments/${commentId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to delete comment" };
    }
};

/**
 * Delete a community post.
 * 
 * @param {string} postId - ID of the post to delete
 * @returns {Object} - Success message or error message
 */
export const deletePost = async (postId) => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.delete(`${BASE_URL}/${postId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to delete post" };
    }
};