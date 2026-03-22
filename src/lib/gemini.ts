import { GoogleGenerativeAI } from "@google/generative-ai";

const PARSE_PROMPT = `You are a business card OCR parser. Extract the following information from the business card image and return ONLY a valid JSON object with these fields:

{
  "name": "이름 (한국어 이름 우선)",
  "nameEn": "English name if available",
  "company": "회사명",
  "department": "부서",
  "position": "직책/직위",
  "phone": "유선전화번호",
  "mobile": "휴대전화번호",
  "email": "이메일",
  "address": "주소",
  "website": "웹사이트",
  "fax": "팩스번호"
}

Rules:
- If a field is not found, set it to null
- For phone numbers, include country code and format nicely (e.g., "010-1234-5678")
- Distinguish between office phone (phone) and mobile phone (mobile). Mobile numbers in Korea start with 010, 011, 016, 017, 018, 019
- Return ONLY the JSON object, no markdown, no explanation
- For Korean business cards, the name is usually the largest text
- Company name is often at the top or has a logo nearby`;

export async function parseBusinessCard(
  imageBase64: string,
  mimeType: string,
  apiKey: string
): Promise<Record<string, string | null>> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

  const result = await model.generateContent([
    PARSE_PROMPT,
    {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    },
  ]);

  const text = result.response.text().trim();

  // Extract JSON from response (handle potential markdown wrapping)
  let jsonStr = text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  return JSON.parse(jsonStr);
}
