/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, SkipForward, Share2 } from "lucide-react";

// Mock data for the leaderboard
const initialTracks = [
  { id: 1, title: "Song 1", votes: 10, videoId: "dQw4w9WgXcQ" },
  { id: 2, title: "Song 2", votes: 8, videoId: "y6120QOlsfU" },
  { id: 3, title: "Song 3", votes: 5, videoId: "fJ9rUzIMcZQ" },
];

export default function Page() {
  const [videoLink, setVideoLink] = useState("");
  const [previewVideoId, setPreviewVideoId] = useState(
    initialTracks[0].videoId
  );
  const [tracks, setTracks] = useState(initialTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractVideoId(videoLink);
    if (videoId) {
      setPreviewVideoId(videoId);

      // Fetch video title from YouTube API
      const response = await fetch(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
      );
      const data = await response.json();
      const title = data.title || "Unknown Title";

      // Add new track to leaderboard
      const newTrack = {
        id: tracks.length + 1,
        title: title,
        votes: 0,
        videoId: videoId,
      };

      setTracks((prevTracks) =>
        [...prevTracks, newTrack].sort((a, b) => b.votes - a.votes)
      );

      setVideoLink("");
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const extractVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleVote = (id: number, increment: number) => {
    setTracks(
      tracks
        .map((track) =>
          track.id === id ? { ...track, votes: track.votes + increment } : track
        )
        .sort((a, b) => b.votes - a.votes)
    );
  };

  const playNextSong = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setPreviewVideoId(tracks[nextIndex].videoId);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this MusicWall!",
          text: "I've created a MusicWall with some great tracks. Come vote for your favorites!",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert(
        "Web Share API is not supported in your browser. You can copy the URL to share."
      );
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">MusicWall Dashboard</h1>
        <Button onClick={handleShare} className="bg-white/10 hover:bg-white/20">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
        <Card className="bg-white/10 ">
          <CardHeader>
            <CardTitle className="text-white">Add New Track</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                placeholder="Paste YouTube video URL"
                className="flex-grow"
              />
              <Button type="submit">Add</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-white">Video Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${previewVideoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/20 text-white ">
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {tracks.map((track) => (
              <li key={track.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://img.youtube.com/vi/${track.videoId}/default.jpg`}
                    alt={track.title}
                    className="w-20 h-15 object-cover"
                  />
                  <span>{track.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{track.votes}</span>
                  <Button size="sm" onClick={() => handleVote(track.id, 1)}>
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={() => handleVote(track.id, -1)}>
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={playNextSong}
          className="bg-white/10 hover:bg-white/20"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Play Next
        </Button>
      </div>
    </div>
  );
}
