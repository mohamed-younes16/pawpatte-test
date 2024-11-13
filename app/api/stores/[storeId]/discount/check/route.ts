import prismadb from "@/lib/prismabd";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return NextResponse.json(
        { message: "Store ID is required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const discountCode = searchParams.get("discountCode");

    if (!userId || !discountCode) {
      return NextResponse.json(
        { message: "User id and discount code is required" },
        { status: 401 }
      );
    }

    const discount = await prismadb.discount.findFirst({
      where: {
        id: {
          startsWith: discountCode.toLocaleLowerCase(),
        },
        isUsed: false,
        discountOwner: {
          id: userId,
        },
      },
    });

    if (discount?.id) {
      return NextResponse.json(
        {
          message: "discount code applied",
          discount,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "no discount code found",
          discount: null,
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("[discount-get-error]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
