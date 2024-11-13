import prismadb, { animalsTypes } from "@/lib/prismabd";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
) {
  try {
    const searchQuery = req.nextUrl.searchParams.get("q") || "";
    console.log(searchQuery);
    if (searchQuery) {
      const isAnimalSearch = animalsTypes.find(
        (e) => e === searchQuery.toLocaleUpperCase()
      );
      let productsOperation;
      if (!!isAnimalSearch) {
        productsOperation = prismadb.product.findMany({
          where: {
            animal: isAnimalSearch,
          },
          include: {
            category: true,
            color: true,
            size: true,
            images: true,
          },
        });
      } else {
        productsOperation = prismadb.product.findMany({
          where: {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          include: {
            category: true,
            color: true,
            size: true,
            images: true,
          },
          take: 10,
        });
      }

      return productsOperation
        .then((e) => {
          return NextResponse.json({ products: e });
        })
        .catch((err) => {
          console.log(err.message);
          return NextResponse.json(
            { message: "Error Happend ❌" },
            { status: 401 }
          );
        });
    } else
      return NextResponse.json(
        { message: "no query provided" },
        { status: 401 }
      );
    {
    }
  } catch (error) {
    console.log("###product--nested-patch########", error);
  }
}
