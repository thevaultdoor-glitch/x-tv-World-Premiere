// FIX: Added import for React to support JSX syntax.
import React from 'react';
import VideoGrid from '@/components/VideoGrid';
import { Video } from '@/types';
import prisma from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';

// Helper function to format numbers
function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(0)}K views`;
  return `${views} views`;
}

async function getVideos(): Promise<Video[]> {
  const videosFromDb = await prisma.video.findMany({
    include: {
      channel: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Map the database model to the frontend Video type
  return videosFromDb.map(video => ({
    id: video.id,
    thumbnailUrl: video.thumbnailUrl,
    title: video.title,
    duration: video.duration,
    channel: {
        name: video.channel.name,
        avatarUrl: video.channel.avatarUrl || '',
        subscriberCount: `${(video.channel.subscriberCount / 1_000_000).toFixed(2)}M subscribers`
    },
    views: formatViews(video.views),
    uploadedAt: formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }),
    category: video.category,
  }));
}


export default async function HomePage() {
  const videos = await getVideos();
  
  return <VideoGrid videos={videos} />;
}