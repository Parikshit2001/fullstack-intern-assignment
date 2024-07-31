import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(req: NextRequest) {
  try {
    const id = req.headers.get("id");
    console.log(id);
    return NextResponse.json({
      message: "You are able to hit authenticated routes",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Error while signing in" },
      { status: 400 }
    );
  }
}
