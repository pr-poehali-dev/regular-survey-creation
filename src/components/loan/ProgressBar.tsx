import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);
  
  const stepLabels = [
    'Параметры',
    'Личные данные', 
    'Контакты',
    'Паспорт',
    'Банковская карта'
  ];

  return (
    <div className="w-full mb-8">
      {/* Основной прогресс-бар */}
      <div className="relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Шаг {currentStep} из {totalSteps}
          </span>
          <span className="text-sm font-bold text-green-600">
            {progressPercentage}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-in-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Анимированный блик */}
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Список шагов */}
      <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div 
              key={index}
              className={`text-center p-2 rounded-lg transition-all duration-300 ${
                isCompleted 
                  ? 'bg-green-100 text-green-700 font-medium' 
                  : isCurrent 
                    ? 'bg-blue-100 text-blue-700 font-semibold ring-2 ring-blue-300' 
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              <div className={`mb-1 w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                isCompleted 
                  ? 'bg-green-500 text-white' 
                  : isCurrent 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
              }`}>
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span className="block leading-tight">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;