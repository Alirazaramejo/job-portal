import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";


import IconBadge from "@/components/IconBadge";
import CompanyName from "./name-form";
import DescriptionForm from "./description-form";
import CompanyLogoForm from "./logo-form";
import CompanySocialForm from "./social-contact-form";
import CompanyCoverImageForm from "./cover-image-form";

const CompanyEditPage = async ({
  params,
}: {
  params: { companyid: string };
}) => {
  // verify the mongodb id
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(params.companyid)) {
    return redirect("/admin/companies");
  }
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const company = await db.company.findUnique({
    where: {
      id: params.companyid,
      userId,
    },
  });
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  if (!company) {
    return redirect("/admin/companies");
  }
  const requiredFields = [
    company.name,
    company.description,
    company.logo,
    company.CoverImage,
    company.mail,
    company.website,
    company.Linkedin,
    company.address_line_1,
    company.city,
    company.state,
    company.overView,
    company.whyJoinUs,
  ];
  const totalField = requiredFields.length;
  const completedField = requiredFields.filter(Boolean).length;
  const completionText = `(${completedField}/${totalField})`;
  const isComplete = requiredFields.every(Boolean);
  return (
    <div className="p-6">
      <Link href={"/admin/companies"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>
      {/* title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Company Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>
      </div>
     

      {/* container layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* left container */}
        <div>
          {/* title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Customize your Company</h2>
          </div>
          {/* name form */}
          <CompanyName initialData={company} companyid={company.id} />
          {/* description form */}
          <DescriptionForm initialData={company} companyid={company.id} />
          {/* company logo */}
          <CompanyLogoForm initialData={company} companyid={company.id} />
        </div>
        {/* right container */}
        <div className="space-y-6">
          <div className="">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Network} />
            <h2 className="text-xl">
              Company Social contacts
            </h2>
         
          </div>
          {/* social contact form */}
          <CompanySocialForm initialData={company} companyid={company.id} />
          {/* company cover image */}
          <CompanyCoverImageForm initialData={company} companyid={company.id} />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CompanyEditPage;
