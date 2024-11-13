"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import CellAction from "./CellAction";

import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export type ProductColumn = {
  id: string;
  name: string;
  createdAt: string;
  category: string;
  size: string;
  color: string[];
  isArchived: boolean;
  isFeatured: boolean;
  price: string;
  image: string;
  animal: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "color",
    cell: ({ row }) => {
      return (
        <div className="flex gap-6 ">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                {" "}
                <div
                  style={{ backgroundColor: row.original.color[0] }}
                  className="rounded-full w-6 h-6"
                />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent
              side="top"
              className="flexcenter flex-wrap max-w-fit gap-2"
            >
              {" "}
              {row.original.color.map((e, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: e }}
                  className="rounded-full w-6 h-6"
                ></div>
              ))}
            </HoverCardContent>
          </HoverCard>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-bold">{formatted}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => (
      <Image
        alt=""
        height={50}
        width={50}
        className="h-[50px] -[50px] object-contain"
        src={row.original.image}
      />
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "animal",
    header: "Animal",
  },
  {
    accessorKey: "isArchived",
    header: "is archived",
  },
  {
    accessorKey: "isFeatured",
    header: "is featured",
  },
  {
    accessorKey: "size",
    header: "size",
  },
  {
    id: "action",
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    },
  },
];
