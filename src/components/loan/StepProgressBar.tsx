import React from 'react';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300 ${
            currentStep >= step 
              ? 'bg-blue-600 text-white shadow-md animate-pulse' 
              : 'bg-gray-200 text-gray-500'
          } ${currentStep === step ? 'ring-4 ring-blue-200 animate-pulse' : ''}`}>
            {step}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 bg-blue-600 rounded-full transition-all duration-500 ease-out animate-pulse"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        >
        </div>
      </div>
    </div>
  );
};

export default StepProgressBar;