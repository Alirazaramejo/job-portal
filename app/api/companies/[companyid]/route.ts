import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request,{params}: {params : {companyid : string}}) => {
    try {
        const {userId} = auth();
        const { companyid } = params;
        const updatedValues = await req.json();
        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }
      
        if(!companyid){
            return new NextResponse("ID is missing", { status: 400 });
        }
        // Create a company post
        const company = await db.company.update({
            where : {
                id : companyid,
                userId
            },
            data : {
                ...updatedValues
            }
        })
        return NextResponse.json(company);
    } catch (error) {
        console.log(`[COMPANY_PATCH_ERROR]: ${error}`);
        return new NextResponse("Internal server error", { status: 500 });
    }
}