import { GoogleGenAI } from "@google/genai";

// Ensure API key is present
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateMarketingCopy = async (topic: string, tone: string): Promise<string> => {
  if (!apiKey) {
    return "请配置 API Key 以使用智能助手功能。";
  }

  try {
    const prompt = `
      你是一位资深的中国福利彩票投注站营销专家。
      请为我写一段用于发微信朋友圈或店内宣传的营销文案。
      
      主题: ${topic}
      语气: ${tone} (例如：喜庆、幽默、紧迫感、专业)
      
      要求:
      1. 符合中国福利彩票的合规要求，不要承诺包中奖。
      2. 多使用emojis使其生动。
      3. 突出"公益"和"娱乐"属性。
      4. 篇幅在150字左右。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Fast response needed
      }
    });

    return response.text || "抱歉，生成文案失败，请稍后重试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "网络连接异常，请检查您的网络设置。";
  }
};
