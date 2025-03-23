import axios from "axios";

// Login APIimport axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://myapp.loca.lt/api/user"; 

// Registration Function
// export const registerUser = async (name, email, password) => {
//     try {
//         const response = await axios.post(`${BASE_URL}/createUser`, { name, email, password });

//         if (response.data.token) {
//             await AsyncStorage.setItem("authToken", response.data.jsonToken); 
//         }

//         return response.data; 
//     } catch (error) {
//         console.error("Registration error:", error);
//         return { error: "Something went wrong. Please try again." };
//     }
// };

// Login Function
// export const loginUser = async (email, password) => {
//     try {
//         const response = await axios.post(`${BASE_URL}/loginUser`, { email, password });

//         if (response.data.token) {
//             await AsyncStorage.setItem("authToken", response.data.jsonToken); 
//         }

//         return response.data;
//     } catch (error) {
//         console.error("Login error:", error);
//         return { error: "Invalid credentials" };
//     }
// };

// for the updating the user
// {name,email,mo_parent,mo_user}

export const updateUser = async (userData, profilePic) => {
    try {
        const token = await AsyncStorage.getItem("authToken"); 

        const formData = new FormData();
        formData.append("name", userData.name);
        formData.append("email", userData.email);
        formData.append("mo_parent", userData.mo_parent);
        formData.append("mo_user", userData.mo_user);

        if (profilePic) {
            formData.append("profilePic", {
                uri: profilePic.uri,
                type: profilePic.type || "image/jpeg",
                name: profilePic.fileName || "profile.jpg",
            });
        }

        const response = await axios.put(`${BASE_URL}/update`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`, 
            },
        });

        return response.data;  
    } catch (error) {
        return { error: error.response?.data?.message || "Update failed" };
    }
};



//  this is for the job suggestions
export const getJobSuggestions = async () => {
    try {
        const token = await AsyncStorage.getItem("authToken"); 
        const response = await axios.put(
            `${BASE_URL}/getSuggetions`,
            {},  
            {
                headers: {
                    Authorization: `Bearer ${token}`,  
                },
            }
        );

        return response.data; 
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to fetch suggestions" };
    }
};

// this is for the add salaries
// totalsalary,
//     salary,
//     essential_expense,
//     non_essential_expense,
//     savings,
//     debt,
//     investment_goals,
//     investment_risk_tolerance,

export const addSalary = async (salaryData) => {
    try {
        const token = await AsyncStorage.getItem("authToken"); 
        const response = await axios.post(`${BASE_URL}/addSalary`, salaryData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
            },
        });

        return response.data; 
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to add salary" };
    }
};


// this is for the update
// totalsalary,
//     salary,
//     essential_expense,
//     non_essential_expense,
//     savings,
//     debt,
//     investment_goals,
//     investment_risk_tolerance,

export const updateSalary = async (updatedData) => {
    try {
        const token = await AsyncStorage.getItem("authToken"); 
        const response = await axios.post(`${BASE_URL}/updatedSalary`, updatedData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Include authentication token
            },
        });

        return response.data; // Returns updated salary data
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to update salary" };
    }
};


/**
 * Create a new financial goal.

 */
// { amount, category, deadline }
export const createGoal = async (goalData) => {
    try {
        const token = await AsyncStorage.getItem("authToken"); 
        const response = await axios.post(`${BASE_URL}/createGoal`, goalData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to create goal" };
    }
};

/**
 * Update an existing financial goal.
  
 { amount, category, deadline }
 */
export const updateGoal = async (goalId, updatedData) => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.put(`${BASE_URL}/udGoal/${goalId}`, updatedData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to update goal" };
    }
};

/**
 * Delete a financial goal.
 here you have to give params for that
 */
export const deleteGoal = async (goalId) => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.delete(`${BASE_URL}/udGoal/${goalId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to delete goal" };
    }
};

/**
 * Fetch AI-generated financial suggestions.
 * 
 * @returns {Object} - AI suggestions or error message
 */
export const getAISuggestionsForFinance = async () => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.get(`${BASE_URL}/getsuggetionforfinance`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to fetch AI suggestions" };
    }
};

/**
 * Update user's skills.
 * 
 * @param {Array} skills - List of skills to update
 * @returns {Object} - Updated user data or error message
 */
export const addSkills = async (skills) => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.post(`${BASE_URL}/addskills`, { skills }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Failed to update skills" };
    }
};



