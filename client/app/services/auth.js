//authtoken is stored in async storage

import AsyncStorage from '@react-native-async-storage/async-storage';



/**
 * Store authentication token
 * @param {string} token - JWT token to store
 * @returns {Promise<void>}
 */
export const storeAuthToken = async (token) => {
    try {
        await AsyncStorage.setItem('authToken', token);
        return true;
    } catch (error) {
        console.error('Error storing auth token:', error);
        throw new Error('Failed to store authentication token');
    }
};

/**
 * Retrieve stored authentication token
 * @returns {Promise<string|null>}
 */
export const getAuthToken = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return token;
    } catch (error) {
        console.error('Error retrieving auth token:', error);
        return null;
    }
};

/**
 * Remove stored authentication token
 * @returns {Promise<void>}
 */
export const removeAuthToken = async () => {
    try {
        await AsyncStorage.removeItem('authToken');
        return true;
    } catch (error) {
        console.error('Error removing auth token:', error);
        throw new Error('Failed to remove authentication token');
    }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export const isAuthenticated = async () => {
    try {
        const token = await getAuthToken();
        return !!token;
    } catch (error) {
        return false;
    }
};

/**
 * Parse JWT token and get user info
 * @param {string} token - JWT token to parse
 * @returns {Object} Decoded token payload
 */
export const parseToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
}; 