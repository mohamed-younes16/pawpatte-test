import prismadb from "@/lib/prismabd";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { email, id }: any = await req.json();
    if (!email || !id) {
      return NextResponse.json(
        { message: "No email or ID provided" },
        { status: 400 }
      );
    }
    const isEmailOwner = await prismadb.user.findFirst({
      where: {
        
        id,
        email,
      },
    });
    if (!isEmailOwner) {
      return NextResponse.json(
        { message: "you can't accessdiscount code" },
        { status: 403 }
      );
    }
    const useraccount = await prismadb.user.findFirst({
      where: {
        id,
        email,
        discount: {
          none: { isSpecial: false },
        },
      },
      include: { discount: true },
    });

    if (!useraccount) {
      return NextResponse.json(
        { message: "User already has a discount code" },
        { status: 403 }
      );
    } else {
      const addingDiscount = await prismadb.discount.create({
        data: {
          amount: 25,
          isUsed: false,
          isSpecial: false,
          discountOwner: { connect: { id, email } },
        },
      });

      return NextResponse.json(
        {
          message: "Created discount successfully ✅",
          discount: addingDiscount,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("###discount-post-error###", error);
    return NextResponse.json(
      { message: "Error occurred while creating discount" },
      { status: 500 }
    );
  }
}

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
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const discount = await prismadb.discount.findFirst({
      where: { discountOwner: { id: userId }, isSpecial: false },
    });

    if (!discount) {
      return NextResponse.json(
        { message: "No available discount for this user" },
        { status: 404 }
      );
    }

    if (discount.isUsed) {
      return NextResponse.json(
        {
          message: "Discount has already been used",
          discount: null,
          isUsed: true,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "User is eligible for a discount code",
        discount,
        isUsed: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[discount-get-error]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
