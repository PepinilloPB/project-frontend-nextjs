import { NextResponse } from "next/server";

export const GET = async (req: any, res: any) =>{
    return NextResponse.json({ message: "OK" }, { status: 200 });
}

export const POST = async (req: Request, res: Response) =>{
    console.log("Hello World")
}