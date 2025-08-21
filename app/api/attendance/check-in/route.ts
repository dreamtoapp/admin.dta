import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If there is already an open session, return it (idempotent)
    const existing = await prisma.attendance.findFirst({
      where: { userId: session.user.id, logoutAt: null },
      orderBy: { loginAt: "desc" },
      select: { id: true, loginAt: true },
    });
    if (existing) {
      return NextResponse.json({ ok: true, sessionId: existing.id, loginAt: existing.loginAt });
    }

    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent") ?? null;

    const created = await prisma.attendance.create({
      data: {
        userId: session.user.id,
        loginAt: new Date(),
        source: "MANUAL_BUTTON",
        ip,
        userAgent,
      },
      select: { id: true, loginAt: true },
    });

    return NextResponse.json({ ok: true, sessionId: created.id, loginAt: created.loginAt });
  } catch (e) {
    console.error("[attendance:check-in]", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


