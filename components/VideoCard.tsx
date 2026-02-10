'use client';

import React from 'react';
import Link from 'next/link';
import type { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <Link href={`/watch/${video.id}`} className="flex flex-col group">
      <div className="relative rounded-lg overflow-hidden">
        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {video.duration}
        </span>
      </div>
      <div className="flex mt-3">
        <div className="flex-shrink-0">
          <img src={video.channel.avatarUrl} alt={video.channel.name} className="w-9 h-9 rounded-full" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-semibold leading-snug line-clamp-2">
            {video.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 hover:text-white">
            {video.channel.name}
          </p>
          <p className="text-xs text-zinc-400">
            {video.views} &bull; {video.uploadedAt}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
