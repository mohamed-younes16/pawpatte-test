import EmailTemplate from "@/app/emails";
import { NextRequest, NextResponse } from "next/server";

import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(req: NextRequest, res: NextResponse) {
  const { discountAmount, promoCode, email }: any = await req.json();
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Hello world",
    react: EmailTemplate({ discountAmount, promoCode }),
  });
  console.log(error);
  if (error) {
    return NextResponse.json({ message: "error" }, { status: 501 });
  } else {
    return NextResponse.json({ message: "email sent" }, { status: 201 });
  }
}
