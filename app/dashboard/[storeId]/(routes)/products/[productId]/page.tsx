import ProducForm from "@/components/forms/ProductForm";

import prismadb from "@/lib/prismabd";
import React from "react";

const page = async ({
  params: { storeId, productId },
}: {
  params: { storeId: string; productId: string };
}) => {
  const colors = await prismadb.color.findMany({
    where: { storeId },
  });
  const categories = await prismadb.category.findMany({
    where: { storeId },
  });

  const sizes = await prismadb.size.findMany({
    where: { storeId },
  });
  const product = await prismadb.product.findFirst({
    where: { id: productId },
    include: {
      images: true,
      color: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <div>
      <ProducForm
        productImages={product?.images!}
        categories={categories}
        sizes={sizes}
        product={{ ...product!, color: product?.color.map((e) => e.id)! }!}
        colors={colors!}
        storeId={storeId}
      />
    </div>
  );
};

export default page;
