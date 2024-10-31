import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const {userId} = auth();
        const { name } = await req.json();
        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if(!name){
            return new NextResponse("name is missing", { status: 400 });
        }
        // Create a job post
        const job = await db.company.create({
            data: {
                userId,
                name
            }
        })
        return NextResponse.json(job);
    } catch (error) {
        console.log(`[COMPANY_POST_ERROR]: ${error}`);
        return new NextResponse("Internal server error", { status: 500 });
    }
}