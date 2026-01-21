"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ContentCategoriesService } from '../lib/services/content-categories.service';

interface AdminCategoryPageProps {}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ContentCategory | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    primary_goal: 'education',
    primary_audience: 'general',
    default_tone: ['educational'],
    default_content_types: ['text'],
    angles: ['problem-solution'],
    guardrails: ['No offensive content'],
    priority: 'medium',
    is_active: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get('/api/content/categories');
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    try {
      await api.create('/api/content/categories', newCategory);
      setShowModal(false);
      setNewCategory({
        name: '',
        description: '',
        primary_goal: 'education',
        primary_audience: 'general',
        default_tone: ['educational'],
        default_content_types: ['text'],
        angles: ['problem-solution'],
        guardrails: ['No offensive content'],
        priority: 'medium',
        is_active: true,
      });
      fetchCategories();
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleEditCategory = async (category: ContentCategory) => {
    try {
      await api.put(`/api/content/categories/${category.id}`, category);
      setShowModal(false);
      setEditingCategory(null);
      fetchCategories();
    } else {
      setEditingCategory(category);
      setShowModal(true);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/api/content/categories/${editingCategory.id}`, editingCategory);
      setShowModal(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
      try {
        await api.delete(`/api/content/categories/${categoryId}`);
        fetchCategories();
        setShowModal(false);
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const openModal = (category: ContentCategory | null = null) => {
    setEditingCategory(category);
    setShowModal(true);
    setNewCategory({
      name: '',
      description: '',
      primary_goal: 'education',
      primary_audience: 'general',
      default_tone: ['educational'],
      default_content_types: ['text'],
      angles: ['problem-solution'],
      guardrails: ['No offensive content'],
      priority: 'medium',
      is_active: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">إدارة فئات المحتوى</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              العودة للوحة التحكم
            </button>
            <button
              onClick={() => {
                setEditingCategory(null);
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إضافة فئة جديدة
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-t-4 border-blue-500 animate-spin rounded-full border-b-transparent flex-shrink-0 ml-2"></div>
            <p className="text-gray-500 text-lg">جاري تحميل...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(category)}
                      className="px-3 py-1 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
                          handleDeleteCategory(category.id);
                        }
                      }}
                      className="px-3 py-1 bg-red-600 text-sm text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      حذفف
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <strong>الهدف:</strong> {category.primary_goal}
                  </div>
                  <div>
                    <strong>الجمهور:</strong> {category.primary_audience}
                  </div>
                  <div>
                    <strong>الأولوية:</strong> {category.priority}
                  </div>
                  <div>
                    <strong>الزوايا:</strong> {category.angles.length}
                  </div>
                  <div>
                    <strong>الأفكار:</strong> جاري التحميل...
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Category Modal */}
      {showModal && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">تعديل فئة</h2>
            <p className="text-gray-600 mb-6">تعديل: {editingCategory.name}</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">اسم الفئة</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">الوصف الفئة</label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">الهدف الاستراتيجي</label>
                <select
                  value={editingCategory.primary_goal}
                  onChange={(e) => setEditingCategory({...editingCategory, primary_goal: e.target.value as any})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="trust">بناء الثقة</option>
                  <option value="objections">معالاعتراضات</option>
                  <option value="education">تعليم وتعليم</option>
                  <option value="conversion">التحويل العملاء</option>
                  <option value="branding">التسويق التجاري</option>
                  <option value="seasonal">مناسبات ومواسم</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">الجمهور المستهدف</label>
                <select
                  value={editingCategory.primary_audience}
                  onChange={(e) => setEditingCategory({...editingCategory, primary_audience: e.target.value as any})}
                  className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="parent">الأهالياء</option>
                  <option value="student">الطلاب</option>
                  <option value="teacher">المعلمون</option>
                  <option value="general">عام</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">الأولوية</label>
                <select
                  value={editingCategory.priority as any}
                  onChange={(e) => setEditingCategory({...editingCategory, priority: e.target.value as any})}
                  className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">عالية</option>
                  <option value="medium">متوسطة</option>
                  <option value="low">منخفض</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">النغمة الافتراضية</label>
                <select
                  value={editingCategory.default_tone[0] || ''}
                  onChange={(e) => {
                    const tones = editingCategory.default_tone;
                    tones.map((tone) => {
                      const enabled = tones.includes(tone);
                      setEditingCategory({...editingCategory, default_tone: tones});
                    }).default_tone;
                  }}
                  className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {editingCategory.default_tone.map((tone, index) => (
                    <option value={tone} enabled={editingCategory.default_tone.includes(tone)}>
                      {tone}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">أنواع المحتوى الافتراضية</label>
                <div className="space-y-2">
                  {editingCategory.default_content_types.map((type, index) => (
                    <span key={type} className="inline-flex items-center gap-2">
                      <input
                        id={type}
                        type="checkbox"
                        checked={editingCategory.default_content_types?.includes(type)}
                        onChange={(e) => {
                          const types = editingCategory.default_content_types || [];
                          const isChecked = types.includes(type);
                          setEditingCategory({...editingCategory, default_content_types: isChecked ? [...types, type] : types.filter(t => t !== type)});
                        }}
                      />
                      <span className="ml-2">{type === 'text' ? 'نص فقط' : type === 'image_text' ? 'صورة مع نص' : type === 'carousel' ? 'معرض صور' : 'فيديو'}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">زوايا الكتابة</label>
                <div className="space-y-2">
                  {editingCategory.angles.map((angle, index) => (
                    <span key={angle} className="inline-flex items-center gap-2">
                      <input
                        id={angle}
                        type="radio"
                        name="angle"
                        checked={editingCategory.angles?.includes(angle)}
                        onChange={(e) => {
                          const angles = editingCategory.angles || [];
                          setEditingCategory({...editingCategory, angles: angles.includes(angle) ? [...angles, angle] : angles.filter(a => a !== angle)});
                        }}
                      />
                      <span className="ml-2">{angle}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">إرشادات مهمة</label>
                <div className="space-y-2">
                  {editingCategory.guardrails.map((guardrail, index) => (
                    <span key={index} className="inline-flex items-center gap-2">
                      <input
                        id={guardrail}
                        type="checkbox"
                        checked={editingCategory.guardrails?.includes(guardrail)}
                        onChange={(e) => {
                          const guardrails = editingCategory.guardrails || [];
                          setEditingCategory({...editingCategory, guardrails: guardrails.includes(guardrail) ? [...guardrails, guardrail] : guardrails.filter(g => g !== guardrail)});
                        }}
                      />
                      <span className="ml-2">{guardrail}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                إلغلاق
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setShowModal(false);
            setEditingCategory(null);
            setNewCategory({
              name: '',
              description: '',
              primary_goal: 'education',
              primary_audience: 'general',
              default_tone: ['calm', 'educational', 'professional', 'reassuring', 'motivational'],
              default_content_types: ['text'],
              angles: ['emotional appeal', 'problem-solution', 'benefit-feature', 'storytelling'],
              guardrails: ['No offensive content', 'Ensure brand alignment', 'Include call-to-action'],
              priority: 'medium',
              is_active: true,
            });
          }}
          className="w-full mt-8 btn-primary text-lg py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          إضافة فئة جديدة
        </button>
      </div>
    </div>
  </div>
  );
}