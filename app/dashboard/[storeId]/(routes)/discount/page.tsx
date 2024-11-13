import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import prismadb from "@/lib/prismabd";
import { format } from "date-fns";

import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { DiscountColumn, columns } from "./components/columns";
import ApiList from "@/components/ApiList";
import { Separator } from "@/components/ui/separator";

const page = async ({
  params: { storeId },
}: {
  params: { storeId: string };
}) => {
  const discounts =
    (await prismadb.discount.findMany({ where: { isSpecial: true } })) || [];
  const formattedDiscounts: DiscountColumn[] = discounts.map((e) => ({
    id: e.id,
    createdAt: format(e.createdAt, "MMMM do , yyyy"),
    amount: +e.amount,
    userEmail: e.userEmail,
    isUsed: e.isUsed,
  }));

  return (
    <div id="content" className="p-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`discounts (${discounts.length})`}
          description="Manage discounts For Your Store"
        />{" "}
        <Link
          href={`/dashboard/${storeId}/discount/new`}
          className="flexcenter"
        >
          <Button className="flexcenter gap-6">
            <PlusCircle /> Add New{" "}
          </Button>
        </Link>
      </div>{" "}
      <Separator className="my-6" />
      <DataTable searchKey="name" columns={columns} data={formattedDiscounts} />
      <ApiList entityName="discount" entitiIdName="discountId" />
    </div>
  );
};

export default page;
