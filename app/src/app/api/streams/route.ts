import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/lib/db";

// @ts-ignore
import youtubesearchapi from "youtube-search-api";

const YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z
    .string()
    .url()
    .refine(
      (url) => {
        const hostname = new URL(url).hostname;
        return (
          hostname.includes("youtube.com") ||
          hostname.includes("youtu.be") ||
          hostname.includes("spotify.com")
        );
      },
      {
        message: "URL must be from YouTube or Spotify",
      }
    ),
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const isYt = data.url.match(YT_REGEX);

    if (!isYt) {
      return NextResponse.json(
        { message: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const extractedId = isYt[1]; // Extract the video ID from the regex match
    const videoDetails = await youtubesearchapi.GetVideoDetails(extractedId);
    const thumbnail = videoDetails.thumbnail.thumbnails;
    thumbnail.sort();

    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
        title: videoDetails.title ?? "No title found",
        smallImgUrl:
          (thumbnail.length > 1
            ? thumbnail[thumbnail.length - 2].url
            : thumbnail[thumbnail.length - 1].url) ??
          "https://t3.ftcdn.net/jpg/04/54/66/12/360_F_454661277_NtQYM8oJq2wOzY1X9Y81FlFa06DVipVD.jpg",
        bigImgUrl: thumbnail
          ? thumbnail[thumbnail.length - 1].url
          : "https://t3.ftcdn.net/jpg/04/54/66/12/360_F_454661277_NtQYM8oJq2wOzY1X9Y81FlFa06DVipVD.jpg",
      },
    });

    return NextResponse.json(
      { message: "Stream added successfully", id: stream.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST handler:", error.message || error);
    return NextResponse.json(
      { message: "Error while adding stream" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.stream.findMany({
      where: {
        userId: creatorId ?? "",
      },
    });

    return NextResponse.json({
      streams,
    });
  } catch (error: any) {
    console.error("Error in GET handler:", error.message || error);
    return NextResponse.json(
      { message: "Error while fetching streams" },
      { status: 500 }
    );
  }
}
