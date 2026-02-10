import React from 'react';
import Link from 'next/link';
import { UsersIcon, ContentIcon, FeatureListIcon } from './Icons';
import type { Video } from '../types';

// This component still uses the navigateTo prop in some places,
// which will be fully removed once all pages are migrated.
interface AdminDashboardProps {
  navigateTo: (page: any) => void;
  recentVideos: Video[]; // Now expecting videos to be passed as props
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigateTo, recentVideos }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-zinc-900 text-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Administrator Dashboard</h1>
        {/* This feature list page doesn't exist yet, but the link is ready */}
        <Link
          href="/admin/features"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
        >
          View Full Feature List
        </Link>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value="1,245,862" 
          icon={<UsersIcon className="w-8 h-8 text-blue-400" />} 
          change="+1.5%" 
          changeType="increase"
        />
        <StatCard 
          title="Total Videos" 
          value="8,732,104" 
          icon={<ContentIcon className="w-8 h-8 text-green-400" />} 
          change="+2,310 today" 
          changeType="increase"
        />
        <StatCard 
          title="Active Streams" 
          value="15,634" 
          icon={<div className="w-8 h-8 flex items-center justify-center"><span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span></div>}
          change="-2.1%" 
          changeType="decrease"
        />
         <StatCard 
          title="Daily Revenue" 
          value="$78,432" 
          icon={<span className="text-3xl text-yellow-400">$</span>} 
          change="+5.8%" 
          changeType="increase"
        />
      </div>

      {/* Recent Videos Table */}
      <div className="bg-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Video Uploads</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-zinc-400 border-b border-zinc-700">
                <th className="py-3 px-4 font-medium">Video Title</th>
                <th className="py-3 px-4 font-medium">Channel</th>
                <th className="py-3 px-4 font-medium">Upload Date</th>
                <th className="py-3 px-4 font-medium">Views</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentVideos.slice(0, 5).map((video, index) => (
                <tr key={video.id} className="border-b border-zinc-700 hover:bg-zinc-700/50">
                  <td className="py-3 px-4 flex items-center">
                      <img src={video.thumbnailUrl} alt={video.title} className="w-16 h-9 rounded object-cover mr-4" />
                      <span className="font-medium">{video.title}</span>
                  </td>
                  <td className="py-3 px-4">{video.channel.name}</td>
                  <td className="py-3 px-4">{video.uploadedAt}</td>
                  <td className="py-3 px-4">{video.views.split(' ')[0]}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${index % 2 === 0 ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                        {index % 2 === 0 ? 'Published' : 'Processing'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                      <button className="text-blue-400 hover:text-blue-300 mr-2">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    change: string;
    changeType: 'increase' | 'decrease';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, changeType }) => {
    const changeColor = changeType === 'increase' ? 'text-green-400' : 'text-red-400';
    return (
        <div className="bg-zinc-800 rounded-lg p-5 flex items-center justify-between">
            <div>
                <p className="text-sm text-zinc-400 mb-1">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
                <p className={`text-xs mt-1 ${changeColor}`}>{change}</p>
            </div>
            <div className="bg-zinc-700/50 rounded-full p-3">
                {icon}
            </div>
        </div>
    );
}

export default AdminDashboard;