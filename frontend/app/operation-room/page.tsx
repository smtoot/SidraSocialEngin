'use client';

import { useState, useEffect } from 'react';
import IdeationStep from '@/components/OperationRoom/IdeationStep';
import CopywritingStep from '@/components/OperationRoom/CopywritingStep';
import VisualDesignStep from '@/components/OperationRoom/VisualDesignStep';
import ReviewSchedulingStep from '@/components/OperationRoom/ReviewSchedulingStep';
import ProgressIndicator from '@/components/OperationRoom/ProgressIndicator';
import Header from '@/components/Layout/Header';
import { ContentCard } from '@/types';

type Step = 'ideation' | 'copywriting' | 'visual' | 'review';

interface StepConfig {
  key: Step;
  label: string;
  description: string;
}

export default function OperationRoomPage() {
  const [currentStep, setCurrentStep] = useState<Step>('ideation');
  const [contentCard, setContentCard] = useState<ContentCard | null>(null);

  useEffect(() => {
    const initialCard: ContentCard = {
      id: 'temp-id',
      topic: '',
      platform: 'facebook',
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContentCard(initialCard);
  }, []);

  const handleStepComplete = (step: Step, data: any) => {
    setContentCard(data);
    const steps: Step[] = ['ideation', 'copywriting', 'visual', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const resetToStart = () => {
    setCurrentStep('ideation');
    const resetCard: ContentCard = {
      id: 'temp-id',
      topic: '',
      platform: 'facebook',
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContentCard(resetCard);
  };

  const steps: StepConfig[] = [
    { key: 'ideation', label: 'توليد الفكرة', description: 'اقتراح 5 أفكار محتوى' },
    { key: 'copywriting', label: 'صياغة المحتوى', description: 'كتابة النص مع السياق الثقافي' },
    { key: 'visual', label: 'التصميم البصري', description: 'اختيار أو توليد صورة' },
    { key: 'review', label: 'المراجعة والجدولة', description: 'مراجعة وجدولة المنشور' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ProgressIndicator 
            currentStep={currentStep} 
            steps={steps}
          />
          
          {currentStep === 'ideation' && contentCard && (
            <IdeationStep
              onComplete={handleStepComplete}
              contentCard={contentCard}
            />
          )}
          
          {currentStep === 'copywriting' && contentCard && (
            <CopywritingStep
              onComplete={handleStepComplete}
              onBack={resetToStart}
              contentCard={contentCard}
            />
          )}
          
          {currentStep === 'visual' && contentCard && (
            <VisualDesignStep
              onComplete={handleStepComplete}
              onBack={() => setCurrentStep('copywriting')}
              contentCard={contentCard}
            />
          )}
          
          {currentStep === 'review' && contentCard && (
            <ReviewSchedulingStep
              onComplete={handleStepComplete}
              onBack={() => setCurrentStep('visual')}
              contentCard={contentCard}
            />
          )}
        </div>
      </main>
    </div>
  );
}
