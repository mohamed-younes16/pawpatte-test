import prismadb from "@/lib/prismabd";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  params: { params: { discountId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("unauthorized", { status: 401 });

    const { userEmail, amount }: any = await req.json();

    if (!userEmail || !amount)
      return new NextResponse("wrong email or amount Provided", {
        status: 401,
      });

    if (userEmail && amount) {
      const discountsOperation = prismadb.discount.update({
        where: {
          id: params.params.discountId!,
        },
        data: { amount, userEmail },
      });

      return discountsOperation
        .then((e) => {
          return NextResponse.json(
            { message: "Updated discount successfully ✅", discount: e },
            { status: 201 }
          );
        })
        .catch((err) => {
          console.log(err.message);
          return NextResponse.json(
            { message: "Error Happend ❌" },
            { status: 500 }
          );
        });
    }
  } catch (error) {
    console.log("###discount--nested-patch########", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("unauthorized", { status: 401 });

    const { userEmail, amount }: any = await req.json();

    if (!userEmail || !amount)
      return new NextResponse("wrong email or amount Provided", {
        status: 401,
      });

    if (userEmail && amount) {
      const discountsOperation = prismadb.discount.create({
        data: { amount, userEmail, isSpecial: true },
      });
      return discountsOperation
        .then((e) => {
          return NextResponse.json(
            { message: "Created discount successfully ✅", discount: e },
            { status: 201 }
          );
        })
        .catch((err) => {
          console.log(err.message);
          return NextResponse.json(
            { message: "Error Happend ❌" },
            { status: 500 }
          );
        });
    }
  } catch (error) {
    console.log("###store--nested-patch########", error);
  }
}
export async function DELETE(
  req: NextRequest,
  params: { params: { discountId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("unauthorized", { status: 401 });
    const { discountId } = params.params;

    const discountsOperation = prismadb.discount.delete({
      where: {
        id: discountId,
      },
    });
    return discountsOperation
      .then((e) => {
        console.log(e);

        return NextResponse.json(
          { message: "Deleted discount successfully ✅", discount: e },
          { status: 201 }
        );
      })
      .catch((err) => {
        console.log(err.message);
        return NextResponse.json(
          { message: "Error Happend ❌" },
          { status: 401 }
        );
      });
  } catch (error) {
    console.log("###store--nested-patch########", error);
  }
}
