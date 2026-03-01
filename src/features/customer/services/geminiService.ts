import { GoogleGenerativeAI } from "@google/generative-ai";
import { MenuItem } from "../types";

// Thay API KEY của bạn vào đây hoặc dùng biến môi trường .env
const API_KEY = "YOUR_GEMINI_API_KEY_HERE";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Gợi ý món ăn thông minh dựa trên Menu hiện tại
 */
export const getAIFoodSuggestions = async (query: string, menu: MenuItem[]) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Tạo ngữ cảnh cho AI biết về Menu của nhà hàng
    const menuContext = menu.map(item => `${item.name} ($${item.price}): ${item.description}`).join("\n");
    
    const prompt = `
      Bạn là một trợ lý nhà hàng cao cấp. Đây là menu của chúng tôi:
      ${menuContext}
      
      Khách hàng hỏi: "${query}"
      Hãy tư vấn món ăn phù hợp nhất từ menu trên. Trả lời ngắn gọn, lịch sự và hấp dẫn.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Xin lỗi, tôi không thể gợi ý món ăn lúc này.";
  }
};

/**
 * Hướng dẫn dịch vụ nhà hàng (Đặt bàn, giờ mở cửa...)
 */
export const getAIReservationGuide = async (query: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Bạn là quản lý nhà hàng. Trả lời câu hỏi sau của khách về dịch vụ (đặt bàn, thời gian, quy định): "${query}"
      Quy tắc của nhà hàng: Mở cửa 8h-22h, đặt bàn trên 10 người cần cọc 20%.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "Xin lỗi, tôi không thể trả lời câu hỏi này.";
  }
};