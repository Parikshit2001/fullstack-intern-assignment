import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    if (!body || !body.username || !body.password) {
      throw new Error("Invalid Inputs");
    }
    const checkUser = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });
    if (!checkUser) {
      throw new Error(`User with username "${body.username}" does not exist`);
    }
    const correctPassword = await bcrypt.compare(
      body.password,
      checkUser.password
    );
    if (!correctPassword) {
      throw new Error("Incorrect Password");
    }
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ id: checkUser.id })
      .setProtectedHeader({ alg: "HS256" })
      .sign(secretKey);
    return NextResponse.json(
      { token, username: checkUser.username },
      { status: 200 }
    );
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
