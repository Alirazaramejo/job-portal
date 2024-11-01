import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Building2, File, LayoutDashboard, ListCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import JobPublishAction from "./_components/JobPublishAction";
import { Banner } from "@/components/Banner";
import IconBadge from "@/components/IconBadge";
import TitleForm from "./_components/TitleForm";
import CategoryForm from "./_components/CategoryForm";
import ImageForm from "./_components/ImageForm";
import ShortDescription from "./_components/ShortDescription";
import ShiftTiming from "./_components/ShiftTimingMode";
import HourlyRate from "./_components/HourlyRate";
import WorkMode from "./_components/WorkMode";
import WorkExperience from "./_components/WorkExperience";
import JobDescription from "./_components/JobDescription";
import TagsForm from "./_components/TagsForm";
import CompanyForm from "./_components/company-form";

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
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: "desc",
    },
  });
  if (!job) {
    return redirect("/admin/jobs");
  }
  const requiredFields = [
    job.title,
    job.description,
    job.imageUrl,
    job.categoryId,
  ];
  const totalField = requiredFields.length;
  const completedField = requiredFields.filter(Boolean).length;
  const completionText = `(${completedField}/${totalField})`;
  const isComplete = requiredFields.every(Boolean);
  return (
    <div className="p-6">
      <Link href={"/admin/jobs"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>
      {/* title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Job Setup</h1>
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
      {!job.isPublished && (
        <Banner
          variant={"warning"}
          label="This is unpublished . It will not be visible in the job list"
        />
      )}

      {/* container layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* left container */}
        <div>
          {/* title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Customize your job</h2>
          </div>
          {/* title form */}
          <TitleForm initialData={job} jobId={job.id} />
          {/* category form */}
          <CategoryForm
            initialData={job}
            jobId={job.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />

          {/* cover image */}
          <ImageForm initialData={job} jobId={job.id} />
          {/* short description */}
          <ShortDescription initialData={job} jobId={job.id} />
          {/* shiftTiming */}
          <ShiftTiming initialData={job} jobId={job.id} />
          {/* HourlyRate */}
          <HourlyRate initialData={job} jobId={job.id} />
          {/* WorkMode */}
          <WorkMode initialData={job} jobId={job.id} />
          {/* yearsOfExperience */}
          <WorkExperience initialData={job} jobId={job.id} />
        </div>
        {/* right container */}
        <div className="space-y-6">
          {/* tags form */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListCheck} />
              <h2 className="text-xl text-neutral-700">Job Requirement</h2>
            </div>
            <TagsForm initialData={job} jobId={job.id} />
           
          </div>
            {/* company form */}

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Building2} />
              <h2 className="text-xl text-neutral-700">Company Details</h2>
            </div>
         
            {/* company form */}
            <CompanyForm
              initialData={job}
              jobId={job.id}
              options={companies.map((company) => ({
                label: company.name,
                value: company.id,
              }))}
            />
          </div>
          {/* attachments */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl text-neutral-700">Job Attachments</h2>
            </div>
         
            {/* company form */}
            
          
          </div>

        </div>
        <div className=""></div>
        {/* description */}
        <div className="col-span-2">
          <JobDescription initialData={job} jobId={job.id} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
