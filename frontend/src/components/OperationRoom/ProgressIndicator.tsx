'use client';

type Step = 'ideation' | 'copywriting' | 'visual' | 'review';

interface StepConfig {
  key: Step;
  label: string;
  description: string;
}

interface ProgressIndicatorProps {
  currentStep: Step;
  steps?: StepConfig[];
}

export default function ProgressIndicator({ currentStep, steps: providedSteps }: ProgressIndicatorProps) {
  const defaultSteps: StepConfig[] = [
    { key: 'ideation', label: 'توليد الفكرة', description: 'اقتراح 5 أفكار محتوى' },
    { key: 'copywriting', label: 'صياغة المحتوى', description: 'كتابة النص مع السياق الثقافي' },
    { key: 'visual', label: 'التصميم البصري', description: 'اختيار أو توليد صورة' },
    { key: 'review', label: 'المراجعة والجدولة', description: 'مراجعة وجدولة المنشور' },
  ];

  const steps = providedSteps || defaultSteps;

  const getStepStatus = (step: Step) => {
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    const stepIndex = steps.findIndex(s => s.key === step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between overflow-x-auto">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.key} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center min-w-[100px]">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${status === 'completed' ? 'bg-green-600 text-white' : ''}
                  ${status === 'current' ? 'bg-blue-600 text-white' : ''}
                  ${status === 'pending' ? 'bg-gray-200 text-gray-400' : ''}
                `}>
                  {status === 'completed' ? '✓' : index + 1}
                </div>
                <div className="mt-2 text-center">
                  <div className={`font-medium text-sm ${status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>
                    {step.label}
                  </div>
                  <div className={`text-xs mt-1 ${status === 'pending' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.description}
                  </div>
                </div>
              </div>
              
              {!isLast && (
                <div className={`
                  w-12 h-1 mx-2 flex-shrink-0
                  ${status === 'completed' ? 'bg-green-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}