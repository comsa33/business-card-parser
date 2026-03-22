import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
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

    // Parse business card with Gemini
    const parsed = await parseBusinessCard(imageBase64, mimeType, apiKey);

    // Upload image to Vercel Blob
    const ext = mimeType.split("/")[1] || "jpg";
    const filename = `cards/${Date.now()}.${ext}`;
    const buffer = Buffer.from(imageBase64, "base64");
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: mimeType,
    });

    return NextResponse.json({
      success: true,
      contact: parsed,
      imageUrl: blob.url,
    });
  } catch (error) {
    console.error("Parse error:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { success: false, error: `명함 파싱 실패: ${message}` },
      { status: 500 }
    );
  }
}
