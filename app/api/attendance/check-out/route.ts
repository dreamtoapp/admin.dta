import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const open = await prisma.attendance.findFirst({
      where: { userId: session.user.id, logoutAt: null },
      orderBy: { loginAt: "desc" },
    });
    if (!open) {
      return NextResponse.json({ ok: true, message: "No open session" });
    }

    const now = new Date();
    const minutes = Math.max(1, Math.ceil((now.getTime() - open.loginAt.getTime()) / 60000));
    await prisma.attendance.update({
      where: { id: open.id },
      data: { logoutAt: now, durationMin: minutes },
    });

    return NextResponse.json({ ok: true, sessionId: open.id, logoutAt: now, durationMin: minutes });
  } catch (e) {
    console.error("[attendance:check-out]", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


