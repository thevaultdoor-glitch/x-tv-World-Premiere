import React from 'react';

interface FeaturesPageProps {
  // This prop will be removed when the page is fully integrated with Next.js routing.
  navigateTo: (page: any) => void;
}

const FeatureCategory: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-zinc-800 rounded-lg p-6">
    <h2 className="text-xl font-bold mb-4 text-blue-400">{title}</h2>
    <ul className="space-y-3 list-disc list-inside text-zinc-300">
      {children}
    </ul>
  </div>
);

const FeatureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li><span className="text-white">{children}</span></li>
);

const FeaturesPage: React.FC<FeaturesPageProps> = ({ navigateTo }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-zinc-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Comprehensive Platform Feature List</h1>
        <button
          onClick={() => navigateTo('admin')}
          className="bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <FeatureCategory title="Core Video Experience">
          <FeatureItem>High-quality video playback (up to 8K)</FeatureItem>
          <FeatureItem>Adaptive Bitrate Streaming (HLS/DASH)</FeatureItem>
          <FeatureItem>Playback speed controls (0.25x to 2x)</FeatureItem>
          <FeatureItem>Quality selector (144p to 8K)</FeatureItem>
          <FeatureItem>Theater mode & Full-screen mode</FeatureItem>
          <FeatureItem>Picture-in-Picture (PiP) support</FeatureItem>
          <FeatureItem>Keyboard shortcuts for player control</FeatureItem>
          <FeatureItem>Autoplay next video</FeatureItem>
          <FeatureItem>Video Chapters for easy navigation</FeatureItem>
          <FeatureItem>360° and VR video support</FeatureItem>
        </FeatureCategory>
        
        <FeatureCategory title="User Interaction & Engagement">
          <FeatureItem>Like / Dislike buttons with counts</FeatureItem>
          <FeatureItem>Commenting system with threaded replies</FeatureItem>
          <FeatureItem>Creator hearting/pinning comments</FeatureItem>
          <FeatureItem>Channel Subscriptions</FeatureItem>
          <FeatureItem>Notification bell (All, Personalized, None)</FeatureItem>
          <FeatureItem>Sharing to social media and via link/embed</FeatureItem>
          <FeatureItem>Add to Playlist / Watch Later functionality</FeatureItem>
          <FeatureItem>Live Chat during premieres and live streams</FeatureItem>
        </FeatureCategory>

        <FeatureCategory title="Content Discovery">
            <FeatureItem>Personalized Homepage Feed (Algorithm-driven)</FeatureItem>
            <FeatureItem>Trending Page for popular content</FeatureItem>
            <FeatureItem>Subscription Feed</FeatureItem>
            <FeatureItem>Advanced Search with filters (date, type, duration)</FeatureItem>
            <FeatureItem>Suggested Videos sidebar</FeatureItem>
            <FeatureItem>Hashtag-based discovery pages</FeatureItem>
            <FeatureItem>Category-specific pages (Gaming, Music, News)</FeatureItem>
        </FeatureCategory>

        <FeatureCategory title="Content Management (Creator Studio)">
            <FeatureItem>Video Upload (Drag & Drop, File Select)</FeatureItem>
            <FeatureItem>Bulk video management</FeatureItem>
            <FeatureItem>Video details editor (Title, Description, Tags)</FeatureItem>
            <FeatureItem>Custom Thumbnail upload</FeatureItem>
            <FeatureItem>Visibility settings (Public, Unlisted, Private)</FeatureItem>
            <FeatureItem>Scheduled publishing</FeatureItem>
            <FeatureItem>Playlist creation and management</FeatureItem>
            <FeatureItem>Comment moderation tools (filters, blocklists)</FeatureItem>
        </FeatureCategory>

        <FeatureCategory title="Community & Channel Features">
            <FeatureItem>Customizable Channel Pages (Banner, Avatar, Layout)</FeatureItem>
            <FeatureItem>Community Tab for posts, polls, and images</FeatureItem>
            <FeatureItem>User @mentions in comments and posts</FeatureItem>
            <FeatureItem>Channel "About" page with links</FeatureItem>
            <FeatureItem>Featured channels and video sections</FeatureItem>
        </FeatureCategory>

        <FeatureCategory title="Monetization (Partner Program)">
            <FeatureItem>Ad Revenue Sharing (pre-roll, mid-roll, post-roll ads)</FeatureItem>
            <FeatureItem>Channel Memberships (paid subscriptions)</FeatureItem>
            <FeatureItem>Super Chat & Super Stickers (live stream donations)</FeatureItem>
            <FeatureItem>Super Thanks (video tipping)</FeatureItem>
            <FeatureItem>Merchandise Shelf integration</FeatureItem>
        </FeatureCategory>

        <FeatureCategory title="Live Streaming">
            <FeatureItem>Real-time video broadcasting (RTMP)</FeatureItem>
            <FeatureItem>Live chat with moderation tools</FeatureItem>
            <FeatureItem>DVR functionality (rewind live stream)</FeatureItem>
            <FeatureItem>Video Premieres (scheduled live-watch event)</FeatureItem>
            <FeatureItem>Live automatic captions</FeatureItem>
        </FeatureCategory>

        <FeatureCategory title="Analytics & Data">
            <FeatureItem>Creator Analytics Dashboard</FeatureItem>
            <FeatureItem>Real-time viewership data</FeatureItem>
            <FeatureItem>Audience demographics and retention reports</FeatureItem>
            <FeatureItem>Traffic source analysis</FeatureItem>
            <FeatureItem>Revenue reporting</FeatureItem>
        </FeatureCategory>

        <FeatureCategory title="Trust, Safety & Copyright">
            <FeatureItem>Content ID system for copyright management</FeatureItem>
            <FeatureItem>Manual copyright claim system</FeatureItem>
            <FeatureItem>Community Guidelines enforcement & strike system</FeatureItem>
            <FeatureItem>Reporting tools for users (video, comment, channel)</FeatureItem>
            <FeatureItem>Restricted Mode for sensitive content</FeatureItem>
        </FeatureCategory>

      </div>
    </div>
  );
};

export default FeaturesPage;