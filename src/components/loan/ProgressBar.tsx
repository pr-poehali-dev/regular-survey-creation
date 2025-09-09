import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const stepLabels = [
    'Параметры',
    'Личные данные', 
    'Документы',
    'Контакты',
    'Финансы',
    'Карта'
  ];

  return (
    <div className="w-full mb-8 px-4">
      {/* Шаги с круглыми цифрами */}
      <div className="flex items-center justify-center">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;
          
          return (
            <div key={index} className="flex items-center">
              {/* Круглая цифра */}
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 transform ${
                    isCompleted 
                      ? 'bg-green-500 text-white scale-110 shadow-lg animate-pulse' 
                      : isCurrent 
                        ? 'bg-blue-500 text-white scale-125 shadow-xl ring-4 ring-blue-200 animate-bounce' 
                        : 'bg-gray-200 text-gray-500 scale-100'
                  }`}
                  style={{
                    animationDuration: isCurrent ? '2s' : '1s',
                    animationIterationCount: isCurrent ? 'infinite' : '1'
                  }}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                
                {/* Название шага */}
                <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                  isCompleted 
                    ? 'text-green-600' 
                    : isCurrent 
                      ? 'text-blue-600 font-semibold' 
                      : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </div>
              
              {/* Соединительная линия */}
              {index < stepLabels.length - 1 && (
                <div className={`h-1 w-12 mx-2 transition-all duration-700 ${
                  stepNumber < currentStep 
                    ? 'bg-gradient-to-r from-green-400 to-green-500 animate-pulse' 
                    : stepNumber === currentStep
                      ? 'bg-gradient-to-r from-blue-400 to-gray-200'
                      : 'bg-gray-200'
                }`} 
                style={{
                  background: stepNumber < currentStep 
                    ? 'linear-gradient(to right, #10b981, #059669)' 
                    : stepNumber === currentStep
                      ? 'linear-gradient(to right, #3b82f6, #e5e7eb)'
                      : '#e5e7eb'
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;