"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import CellAction from "./CellAction";

export type DiscountColumn = {
  id: string;
  amount: number;
  createdAt: String;
  userEmail: string;
  isUsed: boolean;
};

export const columns: ColumnDef<DiscountColumn>[] = [
  {
    accessorKey: "userEmail",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          user Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "amount",
    cell: ({ row }) => {
      return (
        <div className="flex text-lg font-semibold gap-6">
          {row.original.amount}%
        </div>
      );
    },
  },
  {
    accessorKey: "isUsed",
    cell: ({ row }) => {
      return (
        <div className="flex text-lg font-semibold gap-6">
          {row.original.isUsed ? "true" : "false"}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
  {
    id: "action",
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    },
  },
];
