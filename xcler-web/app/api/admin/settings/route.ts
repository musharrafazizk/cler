import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/db";
import { requireAdminSession } from "@/app/api/admin/_auth";

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    return NextResponse.json(await getSettings());
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    return NextResponse.json(await updateSettings(await request.json()));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
