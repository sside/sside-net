import { NextResponse } from "next/server";
import { ContentTypeHeaders } from "../../../../constant/content-type/ContentTypeHeader";
import { getFeed } from "../getFeed";

export async function GET(): Promise<Response> {
    return new NextResponse((await getFeed()).rss2(), {
        headers: {
            ...ContentTypeHeaders.Rss,
        },
    });
}
