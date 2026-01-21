"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'content' | 'settings'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [moderationQueue, setModerationQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userInfo = localStorage.getItem('user_info');
    
    if (!token) {
      router.push('/login');
    } else {
      setUser(userInfo ? JSON.parse(userInfo) : {});
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'users') {
          const response = await api.get('/api/users');
          setUsers(response.data?.data || []);
        } else if (activeTab === 'content') {
          const response = await api.get('/api/content/moderation-queue');
          setModerationQueue(response.data?.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/login');
  };

  const handleApprove = async (cardId: string) => {
    setLoading(true);
    try {
      await api.post(`/api/content/${cardId}/approve`);
      const response = await api.get('/api/content/moderation-queue');
      setModerationQueue(response.data?.data || []);
    } catch (error) {
      console.error('Failed to approve:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (cardId: string) => {
    const reason = prompt('أدخل سبب الرفض:');
    if (!reason) return;
    
    setLoading(true);
    try {
      await api.post(`/api/content/${cardId}/reject`, { reason });
      const response = await api.get('/api/content/moderation-queue');
      setModerationQueue(response.data?.data || []);
    } catch (error) {
      console.error('Failed to reject:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">مرحباً، {user.username || 'Admin'}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            المستخدمين
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'content'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            قائمة المراجعة
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            الإعدادات
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">إدارة المستخدمين</h2>
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا يوجد مستخدمين</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-right">ID</th>
                      <th className="py-3 px-4 text-right">اسم المستخدم</th>
                      <th className="py-3 px-4 text-right">البريد الإلكتروني</th>
                      <th className="py-3 px-4 text-right">الدور</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b">
                        <td className="py-3 px-4">{u.id}</td>
                        <td className="py-3 px-4">{u.username}</td>
                        <td className="py-3 px-4">{u.email || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">قائمة المراجعة</h2>
              <a
                href="/admin/content-review"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                عرض صفحة المراجعة الكاملة
              </a>
            </div>
            {moderationQueue.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا يوجد محتوى قيد المراجعة</p>
            ) : (
              <div className="grid gap-4">
                {moderationQueue.slice(0, 3).map((card) => (
                  <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{card.topic}</h3>
                        <p className="text-sm text-gray-600">
                          بواسطة: {card.author_name || 'غير معروف'}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                        قيد المراجعة
                      </span>
                    </div>
                    
                    {card.copy_text && (
                      <div className="bg-gray-50 p-3 rounded mb-3">
                        <p className="text-gray-700 whitespace-pre-wrap line-clamp-2">{card.copy_text}</p>
                      </div>
                    )}

                    {card.selected_image_url && (
                      <img 
                        src={card.selected_image_url} 
                        alt="صورة" 
                        className="w-full max-h-32 object-contain rounded mb-4"
                      />
                    )}

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleReject(card.id)}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
                      >
                        رفض
                      </button>
                      <button
                        onClick={() => handleApprove(card.id)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                      >
                        موافقة
                      </button>
                    </div>
                  </div>
                ))}
                {moderationQueue.length > 3 && (
                  <div className="text-center pt-4">
                    <a
                      href="/admin/content-review"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      عرض {moderationQueue.length - 3} عنصر آخر
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">الإعدادات</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">إعدادات المنصة</h3>
                <p className="text-gray-600 text-sm">تكوين الإعدادات العامة للمنصة</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">إعدادات النشر</h3>
                <p className="text-gray-600 text-sm">تكوين حسابات التواصل الاجتماعي</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">الأمان</h3>
                <p className="text-gray-600 text-sm">تكوين إعدادات الأمان والصلاحيات</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
