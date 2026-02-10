'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, FireIcon, CollectionIcon, ClockIcon, DashboardIcon, FeatureListIcon, SparklesIcon } from './Icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  
  const sidebarClasses = `
    fixed lg:relative lg:translate-x-0
    top-0 left-0 h-full z-30
    w-64 bg-zinc-900 border-r border-zinc-800
    transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      <aside className={sidebarClasses}>
        <div className="pt-20 lg:pt-6 h-full overflow-y-auto">
          <nav className="px-2">
            <SidebarLink icon={<HomeIcon />} text="Home" href="/" active={pathname === '/'} onClick={onClose} />
            <SidebarLink icon={<FireIcon />} text="Trending" href="/trending" active={pathname === '/trending'} onClick={onClose} />
            <SidebarLink icon={<CollectionIcon />} text="Subscriptions" href="/subscriptions" active={pathname === '/subscriptions'} onClick={onClose} />
          </nav>
          <hr className="my-4 border-zinc-700" />
          <nav className="px-2">
            <h3 className="px-3 py-2 text-sm font-semibold text-zinc-400">Tools</h3>
            <SidebarLink icon={<SparklesIcon />} text="AI Studio" href="/studio" active={pathname === '/studio'} onClick={onClose} />
          </nav>
          <hr className="my-4 border-zinc-700" />
          <nav className="px-2">
            <SidebarLink icon={<ClockIcon />} text="History" href="/history" active={pathname === '/history'} onClick={onClose}/>
            <SidebarLink icon={<DashboardIcon />} text="Admin Dashboard" href="/admin" active={pathname === '/admin'} onClick={onClose} />
          </nav>
        </div>
      </aside>
      {/* Overlay for mobile */}
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/60 z-20 lg:hidden" />}
    </>
  );
};

interface SidebarLinkProps {
  icon: React.ReactNode;
  text: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, text, href, active, onClick }) => {
  const activeClasses = active ? 'bg-zinc-700' : 'hover:bg-zinc-800';
  const commonClasses = `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full`;
  
  return (
    <Link href={href} onClick={onClick} className={`${commonClasses} ${activeClasses}`}>
      <span className="w-6 h-6 mr-4 text-zinc-400">{icon}</span>
      <span>{text}</span>
    </Link>
  );
};

export default Sidebar;
