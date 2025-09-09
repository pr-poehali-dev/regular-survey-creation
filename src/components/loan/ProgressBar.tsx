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
    <div className="w-full mb-6 px-2 md:px-4">
      {/* Компактная версия для мобильных */}
      <div className="block md:hidden">
        {/* Верхняя линия прогресса */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600">
            Шаг {currentStep} из {totalSteps}
          </span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        
        {/* Горизонтальная полоса прогресса */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          >
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Компактные круглые шаги */}
        <div className="flex justify-between items-center">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-blue-500 text-white ring-2 ring-blue-200' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span className={`text-xs mt-1 font-medium text-center leading-tight max-w-12 transition-colors duration-300 ${
                  isCompleted 
                    ? 'text-green-600' 
                    : isCurrent 
                      ? 'text-blue-600 font-semibold' 
                      : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Полная версия для планшетов и десктопа */}
      <div className="hidden md:flex items-center justify-center">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
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