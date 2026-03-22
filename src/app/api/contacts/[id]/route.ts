import { NextRequest, NextResponse } from "next/server";
import { updateContactById, deleteContactById, initTable } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initTable();
    const { id } = await params;
    const contact = await request.json();
    const updated = await updateContactById(id, contact);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/contacts/[id] error:", error);
    return NextResponse.json({ error: "연락처 수정 실패" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initTable();
    const { id } = await params;
    await deleteContactById(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/contacts/[id] error:", error);
    return NextResponse.json({ error: "연락처 삭제 실패" }, { status: 500 });
  }
}
