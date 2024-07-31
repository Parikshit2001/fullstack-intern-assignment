import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { KeyLike } from "crypto";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/authroute")) {
    try {
      const authHeader = req.headers.get("authorization");
      if (!authHeader) {
        throw new Error("No auth Header found");
      }
      if (!authHeader.startsWith("Bearer ")) {
        throw new Error("Auth header does not starts-with Bearer");
      }
      const token = authHeader.split(" ")[1];
      if (token === "null") {
        throw new Error("Token not found");
      }
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload }: { payload: { id: string } } = await jwtVerify(
        token,
        secretKey,
        {
          algorithms: ["HS256"],
        }
      );
      const headers = new Headers(req.headers);
      headers.set("id", payload.id);
      console.log(payload);
      return NextResponse.next({ request: { headers } });
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
}
