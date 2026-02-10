'use client';

import React from 'react';
import VideoCard from './VideoCard';
import type { Video } from '../types';
import { CollectionIcon } from './Icons';
import Link from 'next/link';

interface SubscriptionsPageProps {
  subscriptionVideos: Video[];
}

const SubscriptionsPage: React.FC<SubscriptionsPageProps> = ({ subscriptionVideos }) => {

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Subscriptions</h1>

      {subscriptionVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {subscriptionVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center h-96 bg-zinc-800/50 rounded-lg">
            <CollectionIcon className="w-24 h-24 text-zinc-500 mb-4" />
            <h2 className="text-2xl font-semibold">Your subscriptions are empty</h2>
            <p className="text-zinc-400 mt-2 max-w-sm">
                <Link href="/" className="text-blue-400 hover:underline">Browse videos</Link> to find channels you'll love.
            </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;