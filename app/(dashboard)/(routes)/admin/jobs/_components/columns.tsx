"use client"

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";


export type JobsColumns = {
  id: string;
  title : string;
  company : string;
  category : string;
  createdAt : string;
  isPublished : boolean;
}

export const columns: ColumnDef<JobsColumns>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "isPublished",
    header: "Published",
    cell : ({row}) => {
      const {isPublished} = row.original;
    return (
      <div className={cn("border px-2 py-1 text-xs rounded-md w-24 text-center", isPublished ? "border-emerald-500 bg-emerald-100/80" : "border-red-500 bg-red-100/80")}>
        {isPublished ? "Published" : "Unpublished"}
      </div>
    )
    }
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id : "actions",
    cell : ({row}) =>{
      const {id} = row.original;
      return (
        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant={"ghost"} size={"icon"}>
      <MoreHorizontal className="w-4 h-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
   <Link href={`/admin/jobs/${id}`}>
   <DropdownMenuItem>
    <Pencil className="w-4 h-4 mr-2" />
    Edit
   </DropdownMenuItem>
   
   </Link>
   <Link href={`/admin/jobs/${id}/applicants`}>
   <DropdownMenuItem>
    <Eye className="w-4 h-4 mr-2" />
    Applicants
   </DropdownMenuItem>
   
   </Link>
  </DropdownMenuContent>
</DropdownMenu>

      )
    }
  }
 
]
