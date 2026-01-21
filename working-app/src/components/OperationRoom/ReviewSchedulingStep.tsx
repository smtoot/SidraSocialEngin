'use client';

import { useState } from 'react';
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  PaperAirplaneIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  BuildingLibraryIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { schedulingApi } from '@/lib/api';
import type { ContentCard } from '@/types';

interface ReviewSchedulingStepProps {
  onComplete: (step: 'review', data: any) => void;
  onBack: () => void;
  contentCard: ContentCard | null;
}

interface ScheduledPost {
  date: Date;
  time: string;
  platform: string;
}

export default function ReviewSchedulingStep({ onComplete, onBack, contentCard }: ReviewSchedulingStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedPlatform, setSelectedPlatform] = useState(contentCard?.platform || 'facebook');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const platforms = [
    { id: 'facebook', name: 'فيسبوك', icon: GlobeAltIcon, color: 'bg-blue-600' },
    { id: 'instagram', name: 'إنستغرام', icon: PhotoIcon, color: 'bg-pink-600' },
    { id: 'twitter', name: 'تويتر', icon: DocumentTextIcon, color: 'bg-sky-500' },
    { id: 'telegram', name: 'تيليجرام', icon: PaperAirplaneIcon, color: 'bg-blue-500' },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const currentMonth = new Date();
  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('ar-SA', { month: 'long', year: 'numeric' });

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleSchedule = async () => {
    if (!selectedDate || !contentCard) {
      toast.error('يرجى اختيار تاريخ النشر');
      return;
    }

    setIsSubmitting(true);
    try {
      await schedulingApi.schedulePost(
        contentCard.id,
        selectedDate.toISOString(),
        selectedTime,
        selectedPlatform,
        notes
      );

      const scheduledPost: ScheduledPost = {
        date: selectedDate,
        time: selectedTime,
        platform: selectedPlatform,
      };

      onComplete('review', {
        ...contentCard,
        scheduledDate: selectedDate.toISOString(),
        scheduledTime: selectedTime,
        platform: selectedPlatform,
        scheduledPost,
        status: 'Scheduled',
        notes,
      });

      toast.success('تم جدولة المنشور بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء جدولة المنشور');
      console.error('Error scheduling post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!contentCard) {
      toast.error('لا توجد بطاقة محتوى');
      return;
    }

    setIsSubmitting(true);
    try {
      await schedulingApi.submitForReview(contentCard.id);

      onComplete('review', {
        ...contentCard,
        status: 'UnderReview',
        notes,
      });

      toast.success('تم إرسال المنشور للمراجعة بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال المراجعة');
      console.error('Error submitting for review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToLibrary = async () => {
    if (!contentCard) {
      toast.error('لا توجد بطاقة محتوى');
      return;
    }

    setIsSubmitting(true);
    try {
      await schedulingApi.addToLibrary(contentCard.id);

      onComplete('review', {
        ...contentCard,
        status: 'InLibrary',
        notes,
      });

      toast.success('تم إضافة المنشور إلى مكتبة المحتوى بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء الإضافة للمكتبة');
      console.error('Error adding to library:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronRightIcon className="h-5 w-5 ml-2" />
            العودة للتصميم البصري
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              المراجعة والجدولة
            </h1>
            <p className="text-lg text-gray-600">
              راجع المحتوى واختر مصيره
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Calendar & Scheduling */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <CalendarIcon className="h-5 w-5 ml-2 text-blue-600" />
                  جدول النشر
                </h2>
                <div className="flex items-center space-x-reverse space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <span className="font-medium text-gray-900">{monthName}</span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                
                  {days.map((day, index) => (
                    <div key={index} className="aspect-square">
                      {day ? (
                        <button
                          onClick={() => !isPast(day) && setSelectedDate(day)}
                          disabled={isPast(day)}
                          className={`
                            w-full h-full rounded-lg flex items-center justify-center text-sm font-medium transition-all
                            ${isSelected(day) 
                              ? 'bg-blue-600 text-white' 
                              : isToday(day)
                                ? 'bg-blue-100 text-blue-700 border-2 border-blue-600'
                                : isPast(day)
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'hover:bg-gray-100 text-gray-700'
                            }
                          `}
                        >
                          {day.getDate()}
                        </button>
                      ) : (
                        <div className="w-full h-full"></div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">وقت النشر</h3>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          py-2 px-3 rounded-lg text-sm font-medium transition-all
                          ${selectedTime === time 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Platform Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">منصات النشر</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`
                        p-4 border-2 rounded-lg transition-all flex flex-col items-center
                        ${selectedPlatform === platform.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center mb-2`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{platform.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">ملاحظات إضافية</h2>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24 text-right"
                placeholder="أضف أي ملاحظات أو تعليمات خاصة بالنشر..."
                dir="rtl"
              />
            </div>
          </div>

          {/* Right Column - Post Preview */}
          <div className="space-y-6">
            {/* Post Card Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 ml-2 text-green-600" />
                بطاقة المنشور
              </h3>
              
              <div className="space-y-4">
                {/* Author Info */}
                {contentCard?.authorName && (
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <UserIcon className="h-5 w-5 text-purple-600 ml-2" />
                    <div>
                      <p className="text-xs text-purple-600">المؤلف</p>
                      <p className="font-medium text-purple-900">{contentCard.authorName}</p>
                    </div>
                  </div>
                )}

                {/* Content Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">المحتوى:</p>
                  <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {contentCard?.copyText || 'لا يوجد محتوى'}
                  </div>
                </div>

                {/* Image Preview */}
                {contentCard?.selectedImage && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-2">الصورة:</p>
                    <img
                      src={contentCard.selectedImage.url}
                      alt="Post image"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Post Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">الموضوع:</span>
                    <span className="font-medium">{contentCard?.topic}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">نبرة الصوت:</span>
                    <span className="font-medium">{contentCard?.tone || 'غير محددة'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">السياق الثقافي:</span>
                    <span className="font-medium">{contentCard?.cultureContext || 'غير محدد'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">تاريخ النشر:</span>
                    <span className="font-medium">
                      {selectedDate 
                        ? selectedDate.toLocaleDateString('ar-SA') 
                        : 'غير محدد'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">وقت النشر:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">المنصة:</span>
                    <span className="font-medium">
                      {platforms.find(p => p.id === selectedPlatform)?.name}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">طريقة الإنشاء:</span>
                    <span className="font-medium">
                      {contentCard?.isManualCopy ? 'يدوي' : 'ذكاء اصطناعي'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-6">
              <div className="flex items-center mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600 ml-2" />
                <h3 className="text-lg font-semibold text-green-800">جاهز للنشر</h3>
              </div>
              
              <p className="text-sm text-green-700 mb-4">
                تم إعداد المنشور بشكل كامل. اختر أحد الخيارات أدناه.
              </p>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleSchedule}
                  disabled={!selectedDate || isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block ml-3"></div>
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="h-4 w-4 inline-block ml-3" />
                      جدولة النشر
                    </>
                  )}
                </button>

                <button
                  onClick={handleSubmitForReview}
                  className="w-full btn-secondary"
                  disabled={isSubmitting}
                >
                  <PaperAirplaneIcon className="h-4 w-4 inline-block ml-3" />
                  إرسال للمراجعة
                </button>

                <button
                  onClick={handleAddToLibrary}
                  className="w-full btn-secondary bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                  disabled={isSubmitting}
                >
                  <BuildingLibraryIcon className="h-4 w-4 inline-block ml-3" />
                  إضافة لمكتبة المحتوى
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}