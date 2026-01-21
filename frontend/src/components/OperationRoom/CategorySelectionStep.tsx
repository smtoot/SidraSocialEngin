"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { categoriesApi } from '@/lib/api';
import type { ContentCategory } from '@/types';

interface CategorySelectionStepProps {
  onComplete: (category: ContentCategory) => void;
}

export default function CategorySelectionStep({ onComplete }: CategorySelectionStepProps) {
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>جاري تحميل الفئات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">اختر فئة المحتوى</h2>
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => onComplete(category)}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{category.description}</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            استخدام هذه الفئة
          </button>
        </div>
      ))}
    </div>
  );
}