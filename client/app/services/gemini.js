const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBsgI9CTYtT5X5paRth3Xxczzj2f1XB4tQ");

export const generateResponse = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ 
          model: "models/gemini-1.5-pro-latest",
        });
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        console.log(response);
    
        return response;
      } catch (error) {
        return error.message;
      }
};

