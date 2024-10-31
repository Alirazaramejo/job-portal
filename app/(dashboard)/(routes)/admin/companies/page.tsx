import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { columns, CompanyColumns } from "./_components/columns";
import { format } from "date-fns";
const CompanyOverViewPage = async() => {
    const {userId} = auth();
    if (!userId) {
      return redirect("/")
    }
    const companies = await db.company.findMany({
      where : {
        userId
      },
    
       orderBy  : {
         createdAt : "desc"
       }
     });

      const formattedCompanies : CompanyColumns[] = companies.map((company) => {
        return {
          id : company.id,
       name : company.name ? company.name : "",
        logo : company.logo ? company.logo : "",
        
        createdAt : company.createdAt ? format(company.createdAt.toLocaleDateString(),"MMM d0, yyyy") : "N/A"
        }
      })

    return ( 
        <div className="p-6">
        <div className="flex items-end justify-end">
          <Link href={"/admin/companies/create"}>
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              New Company
            </Button>
          </Link>
        </div>
        {/* data table list of jobs*/}
        <div className="mt-6">
          <DataTable columns={columns} data={formattedCompanies} searchKey="name"/>
        </div>
      </div>);
}
 
export default CompanyOverViewPage;