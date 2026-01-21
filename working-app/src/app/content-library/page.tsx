"use client";

import React, { useEffect, useState } from 'react';
import { libraryApi } from '@/lib/api';
import type { ContentCard } from '@/types';

const ContentLibraryPage: React.FC = () => {
  const [library, setLibrary] = useState<ContentCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const data = await libraryApi.fetchLibrary();
        setLibrary(data as ContentCard[]);
      } catch (e) {
        console.error('Failed to load library', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-semibold mb-4">Content Library</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {library.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{card.topic || 'Untitled'}</div>
                <span className="text-xs text-gray-600">{card.status}</span>
              </div>
              <div className="text-sm text-gray-700 mb-2 line-clamp-2">
                {card.copyText || ''}
              </div>
              {card.selectedImageUrl && (
                <img src={card.selectedImageUrl} alt="thumb" className="w-full h-24 object-cover rounded" />
              )}
              <div className="mt-2 text-xs text-gray-500">Author: {card.authorName || 'Unknown'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentLibraryPage;
