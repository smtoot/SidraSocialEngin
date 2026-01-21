"use client";

import { useState, useEffect } from 'react';
import { categoriesApi } from '@/lib/api';
import type { ContentCategory } from '@/types';

export default function OperationRoomPage() {
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null);

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

  const handleCategorySelect = (category: ContentCategory) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 animate-spin rounded-full border-b-transparent"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الفئات...</p>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              الفئة المحددة: {selectedCategory.name}
            </h2>
            <p className="text-gray-600 mb-6">{selectedCategory.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">تفاصيل الفئة</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">الهدف:</span>
                    <span className="font-medium">{selectedCategory.primary_goal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">الجمهور:</span>
                    <span className="font-medium">{selectedCategory.primary_audience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">الأولوية:</span>
                    <span className="font-medium">{selectedCategory.priority}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">أنواع المحتوى المتاحة</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory.default_content_types.map((type, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {type === 'text' ? 'نص' :
                       type === 'image_text' ? 'صورة مع نص' :
                       type === 'carousel' ? 'كاروسيل' :
                       'فيديو'}
                    </span>
                  ))}
                </div>
                
                <h3 className="font-semibold text-gray-900 mt-4">الزوايا المتاحة</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory.angles.map((angle, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {angle}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={handleBack}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                العودة لاختيار الفئة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">غرفة العمليات</h1>
          <p className="text-lg text-gray-600">اختر فئة المحتوى للبدء في توليد الأفكار</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                {category.priority === 'high' && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">أولوية عالية</span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">الهدف:</span>
                  <span className="font-medium">{category.primary_goal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الجمهور:</span>
                  <span className="font-medium">{category.primary_audience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">أنواع المحتوى:</span>
                  <span className="font-medium">{category.default_content_types.length} أنواع</span>
                </div>
              </div>

              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                استخدام هذه الفئة
              </button>
            </div>
          ))}
        </div>

        {categories.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">لا توجد فئات متاحة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}