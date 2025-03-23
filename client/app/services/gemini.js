const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDRbyO7gcOE2VOf5kdL_zY_LsQJOgF9LE8");

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

