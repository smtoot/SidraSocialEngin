'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronRightIcon, PencilIcon, CheckIcon, SparklesIcon, DocumentIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { copywritingApi } from '@/lib/api';
import type { ContentCard, Tone, CultureContext } from '@/types';

interface CopywritingStepProps {
  onComplete: (step: 'copywriting', data: any) => void;
  onBack: () => void;
  contentCard: ContentCard | null;
}

interface CopywritingForm {
  tone: Tone;
  cultureContext: CultureContext;
  edits: string;
}

interface ManualCopyForm {
  copyText: string;
}

const toneOptions: { value: Tone; label: string; icon: any }[] = [
  { value: 'friendly', label: 'ودودة', icon: SparklesIcon },
  { value: 'professional', label: 'احترافية', icon: DocumentIcon },
  { value: 'creative', label: 'إبداعية', icon: PencilIcon },
  { value: 'formal', label: 'رسمية', icon: CheckIcon },
];

const cultureOptions: { value: CultureContext; label: string; description: string }[] = [
  { 
    value: 'sudanese', 
    label: 'سودانية', 
    description: 'أسلوب عفوي ودودي مناسب للمجتمع السوداني'
  },
  { 
    value: 'british', 
    label: 'بريطانية', 
    description: 'أسلوب رسمي واحترافي للجمهور الأوروبي'
  },
  { 
    value: 'hybrid', 
    label: 'هجين', 
    description: 'مزج بين الأصالة والمعاصرة لجمهور عالمي'
  },
];

export default function CopywritingStep({ onComplete, onBack, contentCard }: CopywritingStepProps) {
  const [copyText, setCopyText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CopywritingForm>({
    defaultValues: {
      tone: 'friendly',
      cultureContext: 'sudanese',
      edits: '',
    },
  });

  const { register: manualRegister, handleSubmit: manualHandleSubmit, formState: { errors: manualErrors } } = useForm<ManualCopyForm>();

  const selectedTone = watch('tone');
  const selectedCulture = watch('cultureContext');

  useEffect(() => {
    if (contentCard?.selectedIdeaId && !contentCard.isManualCopy) {
      generateCopy();
    }
  }, [contentCard]);

  const generateCopy = async () => {
    if (!contentCard?.selectedIdeaId) return;
    
    setIsGenerating(true);
    try {
      const ideaTextSeed = contentCard.selectedIdea?.text || 'فكرة محتوى';
      const response = await copywritingApi.composeCopy({
        cardId: contentCard.id,
        ideaTextSeed: ideaTextSeed,
        tone: selectedTone,
        cultureContext: selectedCulture,
      });
      
      setCopyText(response.copyText);
      setValue('edits', response.copyText);
      toast.success('تم توليد المحتوى بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء توليد المحتوى');
      console.error('Error generating copy:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onManualCopySubmit = async (data: ManualCopyForm) => {
    if (!contentCard) {
      toast.error('يرجى إكمال خطوة توليد الأفكار أولاً');
      return;
    }

    setIsManualSubmitting(true);
    try {
      onComplete('copywriting', {
        ...contentCard,
        copyText: data.copyText,
        tone: 'manual',
        cultureContext: 'manual',
        isManualCopy: true,
        status: 'UnderReview',
      });
      
      toast.success('تم اعتماد المحتوى بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء اعتماد المحتوى');
      console.error('Error adding manual copy:', error);
    } finally {
      setIsManualSubmitting(false);
    }
  };

  const onSubmitCopy = async (data: CopywritingForm) => {
    if (!contentCard || !contentCard.selectedIdeaId) {
      toast.error('يرجى إكمال خطوة توليد الأفكار أولاً');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (contentCard.id !== 'temp-id') {
        await copywritingApi.approveCopy(contentCard.id, data.edits);
      }
      
      onComplete('copywriting', {
        ...contentCard,
        copyText: data.edits,
        tone: data.tone,
        cultureContext: data.cultureContext,
        isManualCopy: false,
        status: 'UnderReview',
      });
      
      toast.success('تم اعتماد المحتوى بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء اعتماد المحتوى');
      console.error('Error submitting copy:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === 'manual') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setMode('ai')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5 ml-2" />
              العودة للذكاء الاصطناعي
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                كتابة المحتوى يدوياً
              </h1>
              <p className="text-gray-600">أضف المحتوى بنفسك دون استخدام الذكاء الاصطناعي</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <form onSubmit={manualHandleSubmit(onManualCopySubmit)} className="space-y-6">
              <div>
                <label htmlFor="copyText" className="block text-lg font-medium text-gray-700 mb-3">
                  محتوى المنشور
                </label>
                <textarea
                  id="copyText"
                  {...manualRegister('copyText', { 
                    required: 'المحتوى مطلوب',
                    minLength: { value: 20, message: 'المحتوى يجب أن يكون 20 حرفاً على الأقل' }
                  })}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-64 text-right font-arabic"
                  placeholder="اكتب محتوى المنشور هنا..."
                  dir="rtl"
                />
                {manualErrors.copyText && (
                  <p className="mt-2 text-sm text-red-600">{manualErrors.copyText.message}</p>
                )}
              </div>

              <div className="flex gap-4">
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
                      إضافة المحتوى
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
            العودة للأفكار
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              صياغة المحتوى
            </h1>
            <div className="flex items-center justify-center space-x-reverse space-x-2 text-sm text-gray-500">
              <span className="flex items-center">
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                    <span className="ml-2">جاري التوليد...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4 text-green-500" />
                    <span className="ml-2">جاهز</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Content Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Editor Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <DocumentIcon className="h-5 w-5 ml-2 text-blue-600" />
                المحتوى
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="edits" className="block text-sm font-medium text-gray-700 mb-2">
                    النص
                  </label>
                  <textarea
                    id="edits"
                    {...register('edits', { required: 'المحتوى مطلوب' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-64 text-right font-arabic"
                    placeholder={isGenerating ? 'جاري التوليد...' : 'اكتب أو عدّل المحتوى هنا...'}
                    disabled={isGenerating}
                    dir="rtl"
                  />
                  {errors.edits && (
                    <p className="mt-1 text-sm text-red-600">{errors.edits.message}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex-1 btn-secondary"
                    disabled={isGenerating}
                  >
                    {isEditing ? (
                      <>
                        <CheckIcon className="h-4 w-4 ml-2" />
                        حفظ
                      </>
                    ) : (
                      <>
                        <PencilIcon className="h-4 w-4 ml-2" />
                        تعديل
                      </>
                    )}
                  </button>
                  
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={generateCopy}
                      disabled={isGenerating}
                      className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                          جاري التوليد...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-4 w-4 ml-2" />
                          توليد جديد
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">الإعدادات</h2>
              
              <form onSubmit={handleSubmit(onSubmitCopy)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نبرة الصوت
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {toneOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setValue('tone', option.value);
                            if (copyText) {
                              setCopyText('');
                              setValue('edits', '');
                            }
                          }}
                          className={`
                            p-4 border-2 rounded-lg transition-all
                            ${selectedTone === option.value 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }
                          `}
                        >
                          <Icon className="h-6 w-6 mx-auto mb-2" />
                          <div className="text-sm font-medium">{option.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السياق الثقافي
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {cultureOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setValue('cultureContext', option.value);
                          if (copyText) {
                            setCopyText('');
                            setValue('edits', '');
                          }
                        }}
                        className={`
                          p-4 border-2 rounded-lg transition-all text-right
                          ${selectedCulture === option.value 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }
                        `}
                      >
                        <div className="font-medium mb-1">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !copyText}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4 ml-2" />
                        اعتماد المحتوى
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {/* Post Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CheckIcon className="h-5 w-5 ml-2 text-green-600" />
                معاينة المنشور
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">المنصة:</span>
                  <span className="font-medium">{contentCard?.platform || 'فيسبوك'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">الحالة:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {contentCard?.status || 'مسودة'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">طول المحتوى:</span>
                  <span className="font-medium">{copyText.length} حرف</span>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">المعاينة</h3>
              
              <div className="bg-white rounded-lg p-4 border border-gray-100 min-h-[200px]">
                {copyText ? (
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap" dir="rtl">
                    {copyText}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    <DocumentIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>سيظهر المحتوى هنا</p>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Input Option */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <UserIcon className="h-5 w-5 ml-2 text-purple-600" />
                كتابة يدوية
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                بدلاً من استخدام الذكاء الاصطناعي، يمكنك كتابة المحتوى بنفسك
              </p>
              <button
                onClick={() => setMode('manual')}
                className="w-full btn-secondary"
              >
                <PencilIcon className="h-4 w-4 ml-2" />
                كتابة يدوية
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}