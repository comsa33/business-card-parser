import { NextRequest, NextResponse } from "next/server";
import { parseBusinessCard } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mimeType } = await request.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json(
        { success: false, error: "이미지 데이터가 없습니다." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "서버에 Gemini API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const parsed = await parseBusinessCard(imageBase64, mimeType, apiKey);

    return NextResponse.json({ success: true, contact: parsed });
  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { success: false, error: "명함 파싱에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
