"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

type ModerationStatus = 'Pending' | 'Approved' | 'Rejected' | 'All';

interface ContentCard {
  id: string;
  topic: string;
  copy_text: string;
  selected_image_url: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  status: string;
  moderation_status: string;
  moderation_reason: string;
  audit_trail: AuditEntry[];
}

interface AuditEntry {
  action: string;
  timestamp: string;
  user: string;
  details?: string;
}

export default function ContentReviewPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [contentList, setContentList] = useState<ContentCard[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ModerationStatus>('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState<ContentCard | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [auditTrailContent, setAuditTrailContent] = useState<ContentCard | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userInfo = localStorage.getItem('user_info');
    
    if (!token) {
      router.push('/login');
    } else {
      setUser(userInfo ? JSON.parse(userInfo) : {});
      fetchContent();
    }
  }, [router]);

  useEffect(() => {
    applyFilters();
  }, [contentList, filter, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const fetchContent = async () => {
    try {
      const response = await api.get('/api/content/moderation-queue');
      setContentList(response.data?.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = contentList;

    // Apply status filter
    if (filter !== 'All') {
      filtered = filtered.filter(item => item.moderation_status === filter);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.topic?.toLowerCase().includes(term) ||
        item.copy_text?.toLowerCase().includes(term) ||
        item.author_name?.toLowerCase().includes(term)
      );
    }

    setFilteredContent(filtered);
  };

  const handleApprove = async () => {
    if (!selectedContent) return;
    
    setActionLoading(true);
    try {
      await api.post(`/api/content/${selectedContent.id}/approve`);
      setShowApproveModal(false);
      setSelectedContent(null);
      await fetchContent();
    } catch (error) {
      console.error('Failed to approve:', error);
      alert('فشلت الموافقة على المحتوى');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedContent || !rejectReason.trim()) {
      alert('الرجاء إدخال سبب الرفض');
      return;
    }
    
    setActionLoading(true);
    try {
      await api.post(`/api/content/${selectedContent.id}/reject`, { reason: rejectReason });
      setShowRejectModal(false);
      setSelectedContent(null);
      setRejectReason('');
      await fetchContent();
    } catch (error) {
      console.error('Failed to reject:', error);
      alert('فشل رفض المحتوى');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleCardExpand = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending': return 'قيد المراجعة';
      case 'Approved': return 'تمت الموافقة';
      case 'Rejected': return 'مرفوض';
      default: return status;
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContent = filteredContent.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showAuditTrailModal = (content: ContentCard) => {
    setAuditTrailContent(content);
    setShowAuditTrail(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">مراجعة المحتوى</h1>
              <p className="text-gray-600 text-sm mt-1">
                {filteredContent.length} عنصر {filter !== 'All' ? `(${filter})` : ''} - صفحة {currentPage} من {totalPages}
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              العودة للوحة التحكم
            </button>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="البحث في المحتوى..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as ModerationStatus)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">الكل</option>
              <option value="Pending">قيد المراجعة</option>
              <option value="Approved">تمت الموافقة</option>
              <option value="Rejected">مرفوض</option>
            </select>

            <button
              onClick={fetchContent}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              تحديث
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {filteredContent.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">لا يوجد محتوى للعرض</h2>
            <p className="text-gray-500">
              {searchTerm ? 'لم يتم العثور على نتائج للبحث' : 'لا يوجد محتوى في قائمة المراجعة'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedContent.map((content) => (
                  <div key={content.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{content.topic}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(content.moderation_status)}`}>
                          {getStatusText(content.moderation_status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>
                          <strong>المؤلف:</strong> {content.author_name || 'غير معروف'}
                        </span>
                        <span>
                          <strong>التاريخ:</strong> {new Date(content.created_at).toLocaleDateString('ar-EG')}
                        </span>
                        {content.updated_at && (
                          <span>
                            <strong>آخر تحديث:</strong> {new Date(content.updated_at).toLocaleDateString('ar-EG')}
                          </span>
                        )}
                      </div>

                      {content.moderation_reason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <p className="text-sm text-red-700">
                            <strong>سبب الرفض:</strong> {content.moderation_reason}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCardExpand(content.id)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        {expandedCards.has(content.id) ? 'إخفاء التفاصيل ▲' : 'عرض التفاصيل ▼'}
                      </button>
                      {content.audit_trail && content.audit_trail.length > 0 && (
                        <button
                          onClick={() => showAuditTrailModal(content)}
                          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                        >
                          عرض السجل ⚙
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{content.topic}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(content.moderation_status)}`}>
                          {getStatusText(content.moderation_status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>
                          <strong>المؤلف:</strong> {content.author_name || 'غير معروف'}
                        </span>
                        <span>
                          <strong>التاريخ:</strong> {new Date(content.created_at).toLocaleDateString('ar-EG')}
                        </span>
                      </div>

                      {content.moderation_reason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <p className="text-sm text-red-700">
                            <strong>سبب الرفض:</strong> {content.moderation_reason}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => toggleCardExpand(content.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      {expandedCards.has(content.id) ? 'إخفاء التفاصيل ▲' : 'عرض التفاصيل ▼'}
                    </button>
                  </div>

                  {expandedCards.has(content.id) && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">النص</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 whitespace-pre-wrap">{content.copy_text}</p>
                          </div>
                        </div>

                        {content.selected_image_url && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">الصورة</h4>
                            <img
                              src={content.selected_image_url}
                              alt="صورة المحتوى"
                              className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                            />
                          </div>
                        )}
                      </div>

                      {content.moderation_status === 'Pending' && (
                        <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => {
                              setSelectedContent(content);
                              setShowRejectModal(true);
                            }}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            رفض
                          </button>
                          <button
                            onClick={() => {
                              setSelectedContent(content);
                              setShowApproveModal(true);
                            }}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            موافقة
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                السابق
              </button>

              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          )}
          </>
        )}
      </main>

      {showApproveModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">تأكيد الموافقة</h2>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من الموافقة على المحتوى: <strong>{selectedContent.topic}</strong>؟
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedContent(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'جاري الموافقة...' : 'موافقة'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">رفض المحتوى</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">سبب الرفض *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="أدخل سبب رفض هذا المحتوى..."
                required
              />
            </div>
            <p className="text-gray-600 mb-6">
              سيتم إرسال سبب الرفض إلى المؤلف للمراجعة.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedContent(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'جاري الرفض...' : 'رفض'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Modal */}
      {showAuditTrail && auditTrailContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">سجل المحتوى</h2>
                <p className="text-gray-600 text-sm">{auditTrailContent.topic}</p>
              </div>
              <button
                onClick={() => {
                  setShowAuditTrail(false);
                  setAuditTrailContent(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {auditTrailContent.audit_trail && auditTrailContent.audit_trail.length > 0 ? (
                <div className="space-y-3">
                  {auditTrailContent.audit_trail.map((entry, index) => (
                    <div key={index} className="border-l-2 border-gray-300 pl-4 relative">
                      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-0"></div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gray-700">{entry.action}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.timestamp).toLocaleString('ar-EG')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>بواسطة:</strong> {entry.user}
                      </p>
                      {entry.details && (
                        <p className="text-sm text-gray-500 mt-1">{entry.details}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0m-9 9h18M15 13a3 3 0 11-6 0m6 3a3 3 0 01-6 0" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">لا يوجد سجل لهذا المحتوى</h3>
                  <p className="text-gray-500">لم يتم تسجيل أي إجراءات لهذا المحتوى بعد</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAuditTrail(false);
                  setAuditTrailContent(null);
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
