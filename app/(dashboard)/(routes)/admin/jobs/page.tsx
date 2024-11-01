import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns, JobsColumns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { format } from "date-fns";

const JobsPageOverview = async () => {
  const {userId} = auth();
if (!userId) {
  return redirect("/")
}
const jobs = await db.job.findMany({
  where : {
    userId
  },
  include : {
    category : true,
    company : true

  },
  orderBy  : {
    createdAt : "desc"
  }
});
const formattedJobs : JobsColumns[] = jobs.map(job=>({
  id : job.id,
  title : job.title,
  company : job.company ? job.company?.name : "",
  category : job.category ? job.category?.name : "N/A",
  isPublished : job.isPublished,
  createdAt : job.createdAt ? format(job.createdAt.toLocaleDateString(),"MMM d0, yyyy") : "N/A"
}))
  return (
    <div className="p-6">
      <div className="flex items-end justify-end">
        <Link href={"/admin/create"}>
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            New Job
          </Button>
        </Link>
      </div>
      {/* data table list of jobs*/}
      <div className="mt-6">
        <DataTable columns={columns} data={formattedJobs} searchKey="title"/>
      </div>
    </div>
  );
};

export default JobsPageOverview;
