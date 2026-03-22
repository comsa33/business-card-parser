import { NextRequest, NextResponse } from "next/server";
import { getContacts, createContact, initTable } from "@/lib/db";

export async function GET() {
  try {
    await initTable();
    const contacts = await getContacts();
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("GET /api/contacts error:", error);
    return NextResponse.json({ error: "연락처 조회 실패" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initTable();
    const contact = await request.json();
    const created = await createContact(contact);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/contacts error:", error);
    return NextResponse.json({ error: "연락처 추가 실패" }, { status: 500 });
  }
}
