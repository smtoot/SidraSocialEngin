'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SparklesIcon, ChevronLeftIcon, CheckIcon, LightBulbIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { ideationApi } from '@/lib/api';
import type { IdeationResponse, ContentCard, IdeaOption } from '@/types';

interface IdeationStepProps {
  onComplete: (step: 'ideation', data: any) => void;
  contentCard: ContentCard | null;
}

interface IdeationForm {
  topic: string;
}

interface ManualIdeaForm {
  ideaText: string;
  ideaRationale: string;
}

export default function IdeationStep({ onComplete, contentCard }: IdeationStepProps) {
  const [ideas, setIdeas] = useState<IdeaOption[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'ai' | 'manual' | 'select'>('ai');
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<IdeationForm>();
  const { register: manualRegister, handleSubmit: manualHandleSubmit, formState: { errors: manualErrors } } = useForm<ManualIdeaForm>();

  useEffect(() => {
    if (!contentCard) {
      const initialCard: ContentCard = {
        id: 'temp-id',
        topic: '',
        platform: 'facebook',
        status: 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onComplete('ideation', initialCard);
    }
  }, []);

  const onGenerateIdeas = async (data: IdeationForm) => {
    setIsGenerating(true);
    try {
      const response: IdeationResponse = await ideationApi.generateIdeas(data.topic);
      setIdeas(response.ideas);
      setMode('select');
      
      if (contentCard) {
        onComplete('ideation', {
          ...contentCard,
          id: response.cardId,
          topic: data.topic,
          isManualIdea: false,
        });
      }
      
      toast.success('تم توليد 5 أفكار بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء توليد الأفكار');
      console.error('Error generating ideas:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onManualIdeaSubmit = async (data: ManualIdeaForm) => {
    if (!contentCard) {
      toast.error('لا توجد بطاقة محتوى متاحة');
      return;
    }

    setIsManualSubmitting(true);
    try {
      const manualIdea: IdeaOption = {
        id: `manual-${Date.now()}`,
        topicId: contentCard.id !== 'temp-id' ? contentCard.id : 'temp',
        text: data.ideaText,
        rationale: data.ideaRationale,
        isManual: true,
      };

      onComplete('ideation', {
        ...contentCard,
        topic: data.ideaText.substring(0, 50),
        selectedIdeaId: manualIdea.id,
        selectedIdea: manualIdea,
        isManualIdea: true,
        status: 'Draft',
      });
      
      toast.success('تم إضافة الفكرة بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة الفكرة');
      console.error('Error adding manual idea:', error);
    } finally {
      setIsManualSubmitting(false);
    }
  };

  const onSelectIdea = async (ideaId: string) => {
    if (!contentCard) {
      toast.error('لا توجد بطاقة محتوى متاحة');
      return;
    }

    setIsSubmitting(true);
    try {
      if (contentCard.id !== 'temp-id') {
        await ideationApi.selectIdea(contentCard.id, ideaId);
      }
      
      const selectedIdeaData = ideas.find(idea => idea.id === ideaId);
      
      onComplete('ideation', {
        ...contentCard,
        selectedIdeaId: ideaId,
        selectedIdea: selectedIdeaData,
        isManualIdea: selectedIdeaData?.isManual || false,
        status: 'Draft',
      });
      
      toast.success('تم اختيار الفكرة بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء اختيار الفكرة');
      console.error('Error selecting idea:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === 'manual') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              إضافة فكرة يدوية
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              أدخل فكرتك بدون استخدام الذكاء الاصطناعي
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <form onSubmit={manualHandleSubmit(onManualIdeaSubmit)} className="space-y-6">
              <div>
                <label htmlFor="ideaText" className="block text-lg font-medium text-gray-700 mb-3">
                  نص الفكرة
                </label>
                <textarea
                  id="ideaText"
                  {...manualRegister('ideaText', { 
                    required: 'الفكرة مطلوبة',
                    minLength: { value: 10, message: 'الفكرة يجب أن تكون 10 أحرف على الأقل' }
                  })}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32 text-right placeholder-gray-400"
                  placeholder="اكتب فكرتك هنا..."
                  dir="rtl"
                />
                {manualErrors.ideaText && (
                  <p className="mt-2 text-sm text-red-600">{manualErrors.ideaText.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="ideaRationale" className="block text-lg font-medium text-gray-700 mb-3">
                  المبرر/السبب
                </label>
                <textarea
                  id="ideaRationale"
                  {...manualRegister('ideaRationale', { 
                    required: 'المبرر مطلوب',
                    minLength: { value: 10, message: 'المبرر يجب أن يكون 10 أحرف على الأقل' }
                  })}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24 text-right placeholder-gray-400"
                  placeholder="لماذا هذه الفكرة مناسبة؟"
                  dir="rtl"
                />
                {manualErrors.ideaRationale && (
                  <p className="mt-2 text-sm text-red-600">{manualErrors.ideaRationale.message}</p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setMode('ai')}
                  className="flex-1 btn-secondary"
                >
                  <ChevronLeftIcon className="h-5 w-5 ml-2" />
                  العودة
                </button>
                <button
                  type="submit"
                  disabled={isManualSubmitting}
                  className="flex-1 btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isManualSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block ml-3"></div>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-5 w-5 inline-block ml-3" />
                      إضافة الفكرة
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              غرفة العمليات
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              الخطوة الأولى: توليد الأفكار
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="space-y-4">
              <button
                onClick={() => setMode('manual')}
                className="w-full btn-primary text-lg py-6 flex items-center justify-center"
              >
                <DocumentTextIcon className="h-6 w-6 ml-3" />
                إضافة فكرة يدوية
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">أو</span>
                </div>
              </div>

              <form onSubmit={handleSubmit(onGenerateIdeas)} className="space-y-6">
                <div>
                  <label htmlFor="topic" className="block text-lg font-medium text-gray-700 mb-3">
                    أو أدخل موضوعاً واستخدم الذكاء الاصطناعي
                  </label>
                  <input
                    id="topic"
                    type="text"
                    {...register('topic', { 
                      required: 'الموضوع مطلوب',
                      minLength: { value: 3, message: 'الموضوع يجب أن يكون 3 أحرف على الأقل' }
                    })}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right placeholder-gray-400"
                    placeholder="مثال: بداية العام الدراسي، العيد الأضحى..."
                    disabled={isGenerating}
                    dir="rtl"
                  />
                  {errors.topic && (
                    <p className="mt-2 text-sm text-red-600">{errors.topic.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full btn-secondary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800 inline-block ml-3"></div>
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 inline-block ml-3" />
                      توليد أفكار بالذكاء الاصطناعي
                    </>
                  )}
                </button>
              </form>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            غرفة العمليات
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            الخطوة الأولى: توليد الأفكار
          </p>
          <div className="inline-flex items-center space-x-reverse space-x-2 text-sm text-gray-500">
            <span className="flex items-center">
              <LightBulbIcon className="h-4 w-4 text-yellow-500" />
              <span className="ml-2">5 أفكار جاهزة للاختيار</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <DocumentTextIcon className="h-6 w-6 ml-2 text-blue-600" />
                الأفكار المقترحة
              </h2>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {ideas.map((idea) => (
                  <div
                    key={idea.id}
                    onClick={() => !isSubmitting && setSelectedIdea(idea.id)}
                    className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${selectedIdea === idea.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-start">
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 mt-1
                        ${selectedIdea === idea.id 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                        }
                      `}>
                        {selectedIdea === idea.id && (
                          <CheckIcon className="h-3 w-3 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">
                          {idea.text}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {idea.rationale}
                        </p>
                        {idea.isManual && (
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <UserIcon className="h-3 w-3 ml-1" />
                            فكرة يدوية
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                اختر فكرة واحدة للمتابعة
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CheckIcon className="h-6 w-6 ml-2 text-green-600" />
                الفكرة المختارة
              </h2>
              
              {selectedIdea ? (
                <div>
                  {(() => {
                    const selectedIdeaData = ideas.find(idea => idea.id === selectedIdea);
                    return selectedIdeaData ? (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          {selectedIdeaData.text}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {selectedIdeaData.rationale}
                        </p>
                        
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500 mb-2">
                            جاهز للمتابعة
                          </p>
                          <div className="flex items-center text-sm text-gray-700">
                            <LightBulbIcon className="h-4 w-4 ml-2 text-yellow-500" />
                            {selectedIdeaData.isManual ? 'فكرة يدوية' : 'مولدة بالذكاء'}
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-400">اختر فكرة من القائمة</p>
                </div>
              )}

              <button
                onClick={() => selectedIdea && onSelectIdea(selectedIdea)}
                disabled={!selectedIdea || isSubmitting}
                className="w-full mt-6 btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block ml-3"></div>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5 inline-block ml-3" />
                    متابعة
                    <ChevronLeftIcon className="h-5 w-5 inline-block mr-3" />
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIdeas([]);
                  setSelectedIdea(null);
                  setMode('ai');
                }}
                className="w-full mt-3 btn-secondary"
              >
                توليد أفكار جديدة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}