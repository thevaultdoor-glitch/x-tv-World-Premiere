import React from 'react';
import SubscriptionsPage from "@/components/SubscriptionsPage";
import prisma from '@/lib/prisma';
import type { Video } from '@/types';
import { formatDistanceToNow } from 'date-fns';

// In a real app, you would get the current user's ID from authentication.
// For now, we'll find a user from our seed data to simulate this.
async function getUserId(userName: string) {
    const user = await prisma.user.findFirst({ where: { name: userName } });
    return user?.id;
}

function formatViews(views: number): string {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(0)}K views`;
    return `${views} views`;
}

async function getSubscriptionVideos(userId: string): Promise<Video[]> {
    const subscriptions = await prisma.subscription.findMany({
        where: { userId: userId },
        select: { channelId: true }
    });
    
    if (subscriptions.length === 0) {
        return [];
    }
    
    const subscribedChannelIds = subscriptions.map(sub => sub.channelId);

    const videosFromDb = await prisma.video.findMany({
        where: {
            channelId: { in: subscribedChannelIds }
        },
        include: { channel: true },
        orderBy: { createdAt: 'desc' },
    });
    
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


export default async function SubscriptionsContainerPage() {
    // We'll simulate getting videos for the "DevPro" user who we can assume is logged in.
    const userId = await getUserId('DevPro');
    let subscriptionVideos: Video[] = [];

    if (userId) {
       subscriptionVideos = await getSubscriptionVideos(userId);
    }

    return <SubscriptionsPage subscriptionVideos={subscriptionVideos} />;
}