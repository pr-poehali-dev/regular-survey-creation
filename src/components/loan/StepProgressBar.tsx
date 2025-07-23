import React from 'react';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className={`relative flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all duration-500 transform ${
            currentStep >= step 
              ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-2xl shadow-blue-500/50 scale-125 rotate-3' 
              : 'bg-gradient-to-br from-gray-600 to-gray-800 text-gray-300 shadow-lg'
          } hover:scale-110`} style={{
            boxShadow: currentStep >= step 
              ? '0 8px 32px rgba(59, 130, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
              : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
          }}>
            <span className="relative z-10">{step}</span>
            {currentStep >= step && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
            )}
          </div>
        ))}
      </div>
      <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out relative"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-white/40 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default StepProgressBar;