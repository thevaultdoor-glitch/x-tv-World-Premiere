import React from 'react';
import AdminDashboard from "@/components/AdminDashboard";
import prisma from '@/lib/prisma';
import type { Video } from '@/types';
import { formatDistanceToNow } from 'date-fns';

function formatViews(views: number): string {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(0)}K views`;
    return `${views} views`;
}

async function getRecentVideos(): Promise<Video[]> {
    const videosFromDb = await prisma.video.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { channel: true },
    });

    return videosFromDb.map(video => ({
        id: video.id,
        title: video.title,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        views: formatViews(video.views),
        uploadedAt: formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }),
        category: video.category,
        channel: {
            name: video.channel.name,
            avatarUrl: video.channel.avatarUrl || '',
            subscriberCount: '' // Not needed for this view
        }
    }));
}

export default async function AdminPage() {
    const recentVideos = await getRecentVideos();
    
    return <AdminDashboard navigateTo={() => {}} recentVideos={recentVideos} />;
}