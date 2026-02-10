'use client';

import React from 'react';
import Link from 'next/link';
import { MenuIcon, WpxTvLogo, SearchIcon, UploadIcon, BellIcon, UserCircleIcon } from './Icons';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-zinc-900/80 backdrop-blur-lg flex items-center justify-between px-4 py-2 sticky top-0 z-20 border-b border-zinc-700">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 lg:hidden">
          <MenuIcon className="w-6 h-6" />
        </button>
        <Link href="/" className="flex items-center ml-2" title="Go to homepage">
          <WpxTvLogo className="w-8 h-8 text-yellow-400" />
          <div className="ml-2 flex flex-col items-start leading-none">
              <span className="text-2xl font-bold tracking-tighter">
                  X TV
              </span>
              <span 
                  style={{ fontFamily: "'Dancing Script', cursive" }} 
                  className="text-base font-bold text-zinc-300"
              >
                  World Premiere
              </span>
          </div>
        </Link>
      </div>
      
      <div className="flex-1 flex justify-center px-4 sm:px-8 lg:px-16">
        <div className="w-full max-w-2xl flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="bg-zinc-700 hover:bg-zinc-600 px-6 py-2 rounded-r-full border border-zinc-700 border-l-0">
            <SearchIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <Link href="/upload" className="p-2 rounded-full hover:bg-zinc-700">
          <UploadIcon className="w-6 h-6" />
        </Link>
        <button className="p-2 rounded-full hover:bg-zinc-700">
          <BellIcon className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full hover:bg-zinc-700">
          <UserCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
