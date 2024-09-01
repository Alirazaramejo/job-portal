import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import JobPublishAction from "./_components/JobPublishAction";
import { Banner } from "@/components/Banner";
import IconBadge from "@/components/IconBadge";
import TitleForm from "./_components/TitleForm";

const JobDetailPage = async ({ params }: { params: { jobId: string } }) => {
  // verify the mongodb id
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(params.jobId)) {
    return redirect("/admin/jobs");
  }
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
      userId,
    },
  });
  if (!job) {
    return redirect("/admin/jobs");
  }
  const requiredFields = [job.title, job.description, job.imageUrl];
  const totalField = requiredFields.length;
  const completedField = requiredFields.filter(Boolean).length;
  const completionText = `(${completedField}/${totalField})`;
  const isComplete = requiredFields.every(Boolean);
  return (
    <div className="p-6">
      <Link href={"/admin/jobs"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4"/>
          Back
        </div>
      </Link>
      {/* title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
                Job Setup
            </h1>
            <span className="text-sm text-neutral-500">
                Complete All Fields {completionText}
            </span>
        </div>
        {/* action button */}
      <JobPublishAction 
      JobId={params.jobId}
      isPublished={job.isPublished}
      disabled={isComplete}
      />

      </div>
      {/* warning before Published the course */}
      {
        !job.isPublished && (
          <Banner
          variant={"warning"}
          label = "This is unpublished . It will not be visible in the job list"
          
          />
        )
      }

      {/* container layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          {/* title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard}  />
            <h2 className="text-xl text-neutral-700">
              Customize your job
            </h2>
          </div>
          {/* title form */}
          <TitleForm  initialData={job} jobId={job.id} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
