'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Video } from '../types';
import { useRouter } from 'next/navigation';
// Note: mockVideos is removed as it's no longer the source of truth
import { LikeIcon, DislikeIcon, ShareIcon, MoreIcon, UserCircleIcon } from './Icons';

interface WatchPageProps {
  video: Video;
  // Suggested videos will be passed from the server component
  // suggestedVideos: Video[];
  watchHistory: string[];
}

const WatchPage: React.FC<WatchPageProps> = ({ video, watchHistory }) => {
  const router = useRouter();

  const handleVideoSelect = (video: Video) => {
    router.push(`/watch/${video.id}`);
  };
  
  // TODO: Fetch suggested videos from an API endpoint instead of mock data.
  const suggestedVideos: Video[] = []; // Placeholder

  
  // State for local like/dislike interactions
  const [likeCount, setLikeCount] = useState(123000); // Mock starting like count
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  
  // Mock the current user ID. In a real app, this would come from an auth context.
  const currentUserId = 'user-id-007';

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => (newLikedState ? prev + 1 : prev - 1));
    // If liking, ensure disliked is false
    if (newLikedState) {
      setIsDisliked(false);
    }
  };

  const handleDislike = () => {
    const newDislikedState = !isDisliked;
    setIsDisliked(newDislikedState);
    // If disliking, ensure liked is false and decrement count if it was liked
    if (newDislikedState && isLiked) {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8">
      {/* Main Content */}
      <div className="flex-grow lg:w-2/3">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl mb-4 flex items-center justify-center overflow-hidden">
           {/* 
              MUX PLAYER INTEGRATION
              - `controls`: This attribute enables the default Mux Player UI, which includes a settings
                menu (cog icon).
              - QUALITY SELECTOR: The quality selector is a built-in feature. If Mux has generated
                multiple quality renditions for the video associated with the `playback-id`, the settings
                menu will automatically contain an option for the user to select their desired quality
                (e.g., 480p, 720p, 1080p, Auto). No additional code is needed to enable this.
           */}
           <mux-player
            stream-type="on-demand"
            playback-id="V69R0201ie50231g1U3ks4a02r767gYAfY"
            metadata-video-title={video.title}
            metadata-viewer-user-id={currentUserId}
            style={{ width: '100%', height: '100%' }}
            controls
           ></mux-player>
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold mb-2">{video.title}</h1>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center mb-4 sm:mb-0">
                <img src={video.channel.avatarUrl} alt={video.channel.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                    <p className="font-semibold">{video.channel.name}</p>
                    <p className="text-sm text-zinc-400">{video.channel.subscriberCount}</p>
                </div>
                <button className="ml-6 bg-white text-black font-semibold px-4 py-2 rounded-full text-sm hover:bg-zinc-200">Subscribe</button>
            </div>
            
            <div className="flex items-center space-x-2">
                <div className="flex items-center bg-zinc-800 rounded-full">
                    <button onClick={handleLike} className={`flex items-center px-4 py-2 hover:bg-zinc-700 rounded-l-full ${isLiked ? 'text-blue-500' : ''}`}>
                        <LikeIcon className="w-5 h-5 mr-2"/> {likeCount.toLocaleString()}
                    </button>
                    <div className="w-px h-6 bg-zinc-600"></div>
                    <button onClick={handleDislike} className={`px-4 py-2 hover:bg-zinc-700 rounded-r-full ${isDisliked ? 'text-blue-500' : ''}`}>
                        <DislikeIcon className="w-5 h-5"/>
                    </button>
                </div>
                 <button className="flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full">
                    <ShareIcon className="w-5 h-5 mr-2"/> Share
                </button>
                <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full">
                    <MoreIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
        
        <div className="bg-zinc-800 rounded-xl p-4 mt-4 text-sm">
            <p className="font-semibold mb-1">{video.views} &bull; {video.uploadedAt}</p>
            <p>This is a sample description for the video. In a real application, this would be the full description provided by the uploader, with support for links and hashtags. #NextJS #Mux #WPXTV</p>
        </div>

        <CommentsSection />
      </div>

      <div className="lg:w-1/3 lg:max-w-md">
        <h2 className="text-lg font-semibold mb-4">Up Next</h2>
        <div className="space-y-3">
          {suggestedVideos.map(nextVideo => (
             <div key={nextVideo.id} className="flex items-start gap-3 cursor-pointer" onClick={() => handleVideoSelect(nextVideo)}>
                <img src={nextVideo.thumbnailUrl} alt={nextVideo.title} className="w-40 rounded-lg"/>
                <div>
                    <h3 className="text-sm font-semibold line-clamp-2">{nextVideo.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{nextVideo.channel.name}</p>
                    <p className="text-xs text-zinc-400">{nextVideo.views} &bull; {nextVideo.uploadedAt}</p>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CommentsSection = () => {
    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">2,345 Comments</h2>
            <div className="flex items-start gap-3 mb-6">
                <UserCircleIcon className="w-10 h-10 text-zinc-500" />
                <input type="text" placeholder="Add a comment..." className="w-full bg-transparent border-b border-zinc-600 focus:border-white focus:outline-none pb-1"/>
            </div>
            {/* Sample Comments */}
            <div className="space-y-6">
                <Comment user="AlexDev" time="2 weeks ago" text="This was an amazing tutorial! Really helped me understand the Next.js App Router." likes="1.2k" />
                <Comment user="MariaUI" time="1 week ago" text="Great content! The explanation on Prisma was super clear." likes="452">
                    <Comment user="AlexDev" time="6 days ago" text="Couldn't agree more! I was stuck on that for ages." likes="88" isReply/>
                    <Comment user="CreatorChannel" time="6 days ago" text="Glad you found it helpful!" likes="203" isReply isCreator/>
                </Comment>
                 <Comment user="TechReviewer" time="3 days ago" text="Fantastic production quality. What camera are you using?" likes="310" />
            </div>
        </div>
    )
}

interface CommentProps {
    user: string;
    time: string;
    text: string;
    likes: string;
    children?: React.ReactNode;
    isReply?: boolean;
    isCreator?: boolean;
}

const Comment: React.FC<CommentProps> = ({ user, time, text, likes, children, isReply, isCreator }) => {
    return (
        <div className="flex items-start gap-3">
            <img src={`https://i.pravatar.cc/40?u=${user}`} alt={user} className={`rounded-full ${isReply ? 'w-6 h-6' : 'w-10 h-10'}`} />
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isCreator ? 'bg-zinc-700 px-2 py-0.5 rounded' : ''}`}>{user}</span>
                    <span className="text-xs text-zinc-400">{time}</span>
                </div>
                <p className="text-sm mt-1">{text}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                    <button className="hover:text-white flex items-center gap-1"><LikeIcon className="w-4 h-4" /> {likes}</button>
                    <button className="hover:text-white"><DislikeIcon className="w-4 h-4" /></button>
                    <button className="hover:text-white font-semibold">Reply</button>
                </div>
                 {children && <div className="mt-4 space-y-4">{children}</div>}
            </div>
        </div>
    )
}

export default WatchPage;