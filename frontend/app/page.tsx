"use client";

import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center dir-rtl" dir="rtl">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Sidra Content Factory</h1>
        <p className="text-gray-600 mb-8">Navigate to core features:</p>
        <div className="inline-flex flex-col gap-4 items-center">
          <a href="/operation-room" className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">غرفة العمليات</a>
          <a href="/content-library" className="px-6 py-3 bg-gray-700 text-white rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors">مكتبة المحتوى</a>
          <a href="/admin/dashboard" className="px-6 py-3 bg-gray-500 text-white rounded-lg text-lg font-medium hover:bg-gray-600 transition-colors">لوحة التحكم</a>
          <a href="/login" className="text-sm text-gray-500 hover:text-gray-700 mt-2">تسجيل الدخول</a>
        </div>
      </div>
      </div>
    </div>
  );
}
