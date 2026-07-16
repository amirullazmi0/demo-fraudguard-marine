import { NextResponse } from "next/server";
import { requireSession } from "@/app/api/_server/auth/session";
import { getUploadAuthenticationParameters } from "@/app/api/_server/services/imagekit.service";

export async function GET() {
  await requireSession();
  try {
    return NextResponse.json({ ...getUploadAuthenticationParameters(), publicKey: process.env.IMAGEKIT_PUBLIC_KEY, urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT });
  } catch {
    return NextResponse.json({ error: "Image upload service is not configured." }, { status: 503 });
  }
}