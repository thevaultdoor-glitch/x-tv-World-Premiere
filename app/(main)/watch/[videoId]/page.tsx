import React from 'react';
import WatchPage from '@/components/WatchPage';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import type { Video } from '@/types';

type WatchPageContainerProps = {
  params: { videoId: string; }
}

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(0)}K views`;
  return `${views} views`;
}

// The page component for /watch/[videoId] is now a Server Component.
export default async function WatchPageContainer({ params }: WatchPageContainerProps) {
  const { videoId } = params;
  
  const videoFromDb = await prisma.video.findUnique({
    where: { id: videoId },
    include: { channel: true }
  });

  if (!videoFromDb) {
    notFound(); // Use Next.js notFound to render a 404 page
  }

  // Map the database model to the frontend Video type for the WatchPage component
  const selectedVideo: Video = {
    id: videoFromDb.id,
    thumbnailUrl: videoFromDb.thumbnailUrl,
    title: videoFromDb.title,
    duration: videoFromDb.duration,
    channel: {
        name: videoFromDb.channel.name,
        avatarUrl: videoFromDb.channel.avatarUrl || '',
        subscriberCount: `${(videoFromDb.channel.subscriberCount / 1_000_000).toFixed(2)}M subscribers`
    },
    views: formatViews(videoFromDb.views),
    uploadedAt: formatDistanceToNow(new Date(videoFromDb.createdAt), { addSuffix: true }),
    category: videoFromDb.category,
  };

  // The WatchPage component itself is a client component ('use client')
  // because it uses hooks like useState, useEffect, etc.
  return (
    <WatchPage video={selectedVideo} watchHistory={[]} />
  );
}