import DiscountForm from "@/components/forms/DiscountForm";
import prismadb from "@/lib/prismabd";
import React from "react";

const page = async ({
  params: { storeId, discountId },
}: {
  params: { storeId: string; discountId: string };
}) => {
  const discount = await prismadb.discount.findFirst({
    where: { id: discountId },
  });

  return (
    <div>
      <DiscountForm discount={discount!} storeId={storeId} />
    </div>
  );
};

export default page;
