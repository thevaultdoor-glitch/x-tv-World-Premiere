
export interface Channel {
  name: string;
  avatarUrl: string;
  subscriberCount: string;
}

export interface Video {
  id: string;
  thumbnailUrl: string;
  title: string;
  duration: string;
  channel: Channel;
  views: string;
  uploadedAt: string;
  category: string;
}