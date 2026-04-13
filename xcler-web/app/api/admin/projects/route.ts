import { NextResponse } from "next/server";
import { createProject, getProjects } from "@/lib/db";
import { requireAdminSession } from "@/app/api/admin/_auth";

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    return NextResponse.json(await getProjects());
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    return NextResponse.json(await createProject(await request.json()));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
