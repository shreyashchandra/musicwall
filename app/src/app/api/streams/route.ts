import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/lib/db";
import { url } from "inspector";

const YT_REGEX = new RegExp(
  "^(?:(?:https?:)?//)?(?:www.)?(?:m.)?(?:youtu(?:be)?.com/(?:v/|embed/|watch(?:/|?v=))|youtu.be/)((?:w|-){11})(?:S+)?$"
);

// const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
// const spotifyRegex = /^(https?:\/\/)?(open\.)?spotify\.com\/.+$/;

// const CreateStreamSchema = z.object({
//   creatorId: z.string(),
//   url: z
//     .string()
//     .refine((url) => youtubeRegex.test(url) || spotifyRegex.test(url), {
//       message: "URL must be from YouTube or Spotify",
//     }),
// });

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
    const isYt = YT_REGEX.test(data.url);

    if (!isYt) {
      return NextResponse.json(
        {
          message: "Wrong url",
        },
        { status: 411 }
      );
    }

    const extractedId = data.url.split("?v=")[1];
    prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while adding stream",
      },
      { status: 411 }
    );
  }
}
