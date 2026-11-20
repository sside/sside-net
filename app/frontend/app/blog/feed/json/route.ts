import { NextResponse } from "next/server";
import { ContentTypeHeaders } from "../../../../constant/content-type/ContentTypeHeader";
import { getFeed } from "../getFeed";

export async function GET(): Promise<Response> {
    return new NextResponse((await getFeed()).json1(), {
        headers: {
            ...ContentTypeHeaders.JsonFeed,
        },
    });
}
