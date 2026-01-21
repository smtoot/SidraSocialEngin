'use client';

import Link from 'next/link';
import { Cog6ToothIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              مصنع سدرة
            </Link>
          </div>
          
          <nav className="flex items-center space-x-reverse space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <UserCircleIcon className="h-6 w-6 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}