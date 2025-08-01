import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ProcessingScreenProps {
  processingTimer: number;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ processingTimer }) => {
  const getStatusText = () => {
    if (processingTimer > 45) return "Получаем ваши данные...";
    if (processingTimer > 30) return "Проверяем кредитную историю...";
    if (processingTimer > 15) return "Анализируем платежеспособность...";
    return "Принимаем решение...";
  };

  const getStatusIcon = () => {
    if (processingTimer > 45) return "Download";
    if (processingTimer > 30) return "Search";
    if (processingTimer > 15) return "Calculator";
    return "CheckCircle";
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('/img/8f60907b-2d93-41c9-848d-34fe66f9edee.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Затемняющий оверлей */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <Card className="w-full max-w-lg mx-4 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 relative z-10">
        <CardContent className="p-8 sm:p-12 text-center">
          <div className="mb-8">
            {/* Анимированная иконка */}
            <div className="w-28 h-28 mx-auto mb-8 relative">
              <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 border-4 border-gradient-to-r from-blue-500 to-green-500 rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute inset-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Icon name={getStatusIcon()} size={32} className="text-white" />
              </div>
            </div>
            
            {/* Заголовок */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              🚀 Обрабатываем заявку
            </h2>
            
            {/* Динамический статус */}
            <p className="text-lg text-gray-700 mb-6 font-medium">
              {getStatusText()}
            </p>
            
            {/* Таймер */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent text-4xl font-mono font-bold mb-4">
              {Math.floor(processingTimer / 60)}:{(processingTimer % 60).toString().padStart(2, '0')}
            </div>
            
            {/* Прогресс бар */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${((60 - processingTimer) / 60) * 100}%` }}
              ></div>
            </div>
            
            {/* Информационные блоки */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-xl p-4">
                <Icon name="Shield" size={20} className="text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">Безопасно</p>
                <p className="text-xs text-gray-600">SSL защита</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <Icon name="Zap" size={20} className="text-green-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">Быстро</p>
                <p className="text-xs text-gray-600">До 15 минут</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <Icon name="Star" size={20} className="text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800">Надёжно</p>
                <p className="text-xs text-gray-600">Лицензия ЦБ</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingScreen;