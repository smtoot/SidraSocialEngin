'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { 
  PhotoIcon, 
  SparklesIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  CheckIcon,
  CameraIcon,
  PaintBrushIcon,
  PuzzlePieceIcon,
  CloudArrowUpIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { visualDesignApi } from '@/lib/api';
import type { ContentCard } from '@/types';

interface VisualDesignStepProps {
  onComplete: (step: 'visual', data: any) => void;
  onBack: () => void;
  contentCard: ContentCard | null;
}

interface ImageOption {
  id: string;
  url: string;
  prompt: string;
  source: 'generated' | 'library' | 'upload';
}

const sampleImages: ImageOption[] = [
  {
    id: 'lib-1',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    prompt: 'طلاب في فصل دراسي، تعليم، تفاؤل',
    source: 'library'
  },
  {
    id: 'lib-2',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
    prompt: 'كتب ومعرفة، مكتبة، تعليم',
    source: 'library'
  },
  {
    id: 'lib-3',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    prompt: 'قلم وورقة، كتابة، إبداع',
    source: 'library'
  },
  {
    id: 'lib-4',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    prompt: 'فريق عمل، تعاون، نجاح',
    source: 'library'
  },
  {
    id: 'lib-5',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    prompt: 'طفل يدرس، تعليم، المستقبل',
    source: 'library'
  },
  {
    id: 'lib-6',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    prompt: 'تقنية، تعلم رقمي، حاسوب',
    source: 'library'
  }
];

export default function VisualDesignStep({ onComplete, onBack, contentCard }: VisualDesignStepProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'library' | 'upload'>('generate');
  const [generatedImages, setGeneratedImages] = useState<ImageOption[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageOption | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('modern');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (contentCard?.copyText) {
      setImagePrompt(contentCard.copyText.substring(0, 200));
    }
  }, [contentCard]);

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error('يرجى إدخال وصف للصورة');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await visualDesignApi.generateImage(imagePrompt, imageStyle);
      
      const newImage: ImageOption = {
        id: `gen-${Date.now()}`,
        url: response.url,
        prompt: response.prompt,
        source: 'generated'
      };

      setGeneratedImages([newImage, ...generatedImages]);
      toast.success('تم توليد الصورة بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء توليد الصورة');
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!uploadedFile || !contentCard) {
      toast.error('يرجى اختيار صورة للرفع');
      return;
    }

    setIsUploading(true);
    try {
      const response = await visualDesignApi.uploadImage(contentCard.id, uploadedFile);
      
      const uploadedImage: ImageOption = {
        id: response.id,
        url: response.url,
        prompt: 'صورة مرفوعة',
        source: 'upload'
      };

      setGeneratedImages([uploadedImage, ...generatedImages]);
      setSelectedImage(uploadedImage);
      setUploadPreview(null);
      setUploadedFile(null);
      toast.success('تم رفع الصورة بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء رفع الصورة');
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const selectImage = async (image: ImageOption) => {
    setSelectedImage(image);
    toast.success('تم اختيار الصورة!');
  };

  const handleContinue = async () => {
    if (!selectedImage || !contentCard) {
      toast.error('يرجى اختيار صورة أولاً');
      return;
    }

    try {
      await visualDesignApi.selectImage(contentCard.id, {
        id: selectedImage.id,
        url: selectedImage.url,
        prompt: selectedImage.prompt,
        source: selectedImage.source
      });

      onComplete('visual', {
        ...contentCard,
        selectedImage,
        status: 'ReadyForReview',
      });
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ الصورة');
      console.error('Error saving image:', error);
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
            <ArrowRightIcon className="h-5 w-5 ml-2" />
            العودة لصياغة المحتوى
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              التصميم البصري
            </h1>
            <p className="text-lg text-gray-600">
              اختر أو أنشئ أو ارفع صورة مناسبة لمحتواك
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image Generation/Library */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex space-x-reverse space-x-4">
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`
                    flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center
                    ${activeTab === 'generate' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <SparklesIcon className="h-5 w-5 ml-2" />
                  توليد بالذكاء
                </button>
                <button
                  onClick={() => setActiveTab('library')}
                  className={`
                    flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center
                    ${activeTab === 'library' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <PhotoIcon className="h-5 w-5 ml-2" />
                  مكتبة الصور
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`
                    flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center
                    ${activeTab === 'upload' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <CloudArrowUpIcon className="h-5 w-5 ml-2" />
                  رفع صورة
                </button>
              </div>
            </div>

            {/* Generate Tab */}
            {activeTab === 'generate' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <PaintBrushIcon className="h-5 w-5 ml-2 text-purple-600" />
                  وصف الصورة
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف الصورة بالتفصيل
                    </label>
                    <textarea
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32 text-right"
                      placeholder="اشرح ما تريد أن تراه في الصورة..."
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      أسلوب التصميم
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'modern', label: 'حديث', icon: SparklesIcon },
                        { value: 'classic', label: 'كلاسيكي', icon: PuzzlePieceIcon },
                        { value: 'minimal', label: 'بسيط', icon: PhotoIcon },
                        { value: 'creative', label: 'إبداعي', icon: PaintBrushIcon },
                      ].map((style) => {
                        const Icon = style.icon;
                        return (
                          <button
                            key={style.value}
                            type="button"
                            onClick={() => setImageStyle(style.value)}
                            className={`
                              p-3 border-2 rounded-lg transition-all flex flex-col items-center
                              ${imageStyle === style.value 
                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              }
                            `}
                          >
                            <Icon className="h-6 w-6 mb-1" />
                            <span className="text-sm">{style.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={generateImage}
                    disabled={isGenerating || !imagePrompt.trim()}
                    className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block ml-3"></div>
                        جاري التوليد...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-5 w-5 inline-block ml-3" />
                        توليد الصورة
                      </>
                    )}
                  </button>
                </div>

                {/* Generated Images */}
                {generatedImages.filter(img => img.source === 'generated').length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">الصور المُولّدة</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {generatedImages.filter(img => img.source === 'generated').map((image) => (
                        <div
                          key={image.id}
                          onClick={() => selectImage(image)}
                          className={`
                            relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                            ${selectedImage?.id === image.id 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className="w-full h-48 object-cover"
                          />
                          {selectedImage?.id === image.id && (
                            <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1">
                              <CheckIcon className="h-4 w-4" />
                            </div>
                          )}
                          <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <p className="text-white text-xs truncate">{image.prompt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Library Tab */}
            {activeTab === 'library' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <PhotoIcon className="h-5 w-5 ml-2 text-green-600" />
                  مكتبة الصور
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
                  {sampleImages.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => selectImage(image)}
                      className={`
                        relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                        ${selectedImage?.id === image.id 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-40 object-cover"
                      />
                      {selectedImage?.id === image.id && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1">
                          <CheckIcon className="h-4 w-4" />
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs truncate">{image.prompt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <CloudArrowUpIcon className="h-5 w-5 ml-2 text-blue-600" />
                  رفع صورة من جهازك
                </h2>
                
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <CloudArrowUpIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-2">انقر لاختيار صورة أو اسحبها هنا</p>
                    <p className="text-sm text-gray-400">PNG, JPG, GIF - 最大 5MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {uploadPreview && (
                    <div className="space-y-4">
                      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={uploadPreview}
                          alt="معاينة الصورة"
                          className="w-full h-64 object-contain"
                        />
                      </div>
                      <button
                        onClick={uploadImage}
                        disabled={isUploading}
                        className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block ml-3"></div>
                            جاري الرفع...
                          </>
                        ) : (
                          <>
                            <CloudArrowUpIcon className="h-5 w-5 inline-block ml-3" />
                            رفع الصورة
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {uploadedFile && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">الملف المختار:</p>
                      <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="space-y-6">
            {/* Selected Image Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CameraIcon className="h-5 w-5 ml-2 text-blue-600" />
                الصورة المختارة
              </h3>
              
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.prompt}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">الوصف:</p>
                    <p className="text-sm text-gray-900">{selectedImage.prompt}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>المصدر:</span>
                    <span className={`
                      px-2 py-1 rounded-full text-xs
                      ${selectedImage.source === 'generated' 
                        ? 'bg-purple-100 text-purple-700' 
                        : selectedImage.source === 'upload'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                      }
                    `}>
                      {selectedImage.source === 'generated' 
                        ? 'توليد بالذكاء' 
                        : selectedImage.source === 'upload'
                        ? 'صورة مرفوعة'
                        : 'مكتبة الصور'
                      }
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CameraIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-400">اختر أو أنشئ أو ارفع صورة للمتابعة</p>
                </div>
              )}
            </div>

            {/* Content Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">ملخص المنشور</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">الموضوع:</span>
                  <p className="font-medium text-gray-900">{contentCard?.topic || 'غير محدد'}</p>
                </div>
                
                <div>
                  <span className="text-gray-500">نبرة الصوت:</span>
                  <p className="font-medium text-gray-900">{contentCard?.tone || 'غير محددة'}</p>
                </div>
                
                <div>
                  <span className="text-gray-500">السياق الثقافي:</span>
                  <p className="font-medium text-gray-900">{contentCard?.cultureContext || 'غير محدد'}</p>
                </div>
                
                <div>
                  <span className="text-gray-500">المنصة:</span>
                  <p className="font-medium text-gray-900">{contentCard?.platform || 'فيسبوك'}</p>
                </div>
                
                {contentCard?.authorName && (
                  <div>
                    <span className="text-gray-500">المؤلف:</span>
                    <p className="font-medium text-gray-900 flex items-center">
                      <UserIcon className="h-4 w-4 ml-1" />
                      {contentCard.authorName}
                    </p>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-500">حالة المحتوى:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {contentCard?.status || 'مسودة'}
                  </span>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!selectedImage}
              className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <>
                <ArrowLeftIcon className="h-5 w-5 inline-block ml-3" />
                المتابعة للمراجعة والجدولة
              </>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}