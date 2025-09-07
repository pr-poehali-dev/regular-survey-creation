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
      className="min-h-screen flex items-center justify-center py-6 relative overflow-hidden"
      style={{
        backgroundImage: `url('/img/8f60907b-2d93-41c9-848d-34fe66f9edee.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Современный градиентный оверлей */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-blue-900/30 to-indigo-900/40 backdrop-blur-sm" />
      
      <Card className="w-full max-w-2xl mx-4 bg-white/98 backdrop-blur-lg rounded-3xl shadow-3xl border border-white/40 relative z-10 hover:shadow-4xl transition-all duration-500">
        <CardContent className="p-10 sm:p-16 text-center">
          <div className="mb-10">
            {/* Современная анимированная иконка */}
            <div className="w-36 h-36 mx-auto mb-10 relative">
              <div className="absolute inset-0 border-4 border-gradient-to-r from-blue-200 to-green-200 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute inset-3 border-4 border-gradient-to-r from-blue-500 to-green-500 rounded-full animate-spin border-t-transparent shadow-md"></div>
              <div className="absolute inset-6 bg-gradient-to-br from-blue-500 via-blue-600 to-green-500 rounded-full flex items-center justify-center shadow-xl">
                <Icon name={getStatusIcon()} size={40} className="text-white" />
              </div>
              {/* Дополнительные кольца */}
              <div className="absolute inset-1 border-2 border-blue-100 rounded-full animate-ping opacity-20"></div>
            </div>
            
            {/* Современный заголовок */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🚀</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Обрабатываем заявку
                </h2>
              </div>
              
              {/* Динамический статус */}
              <p className="text-xl text-gray-700 mb-8 font-semibold leading-relaxed">
                {getStatusText()}
              </p>
            </div>
            
            {/* Современный таймер */}
            <div className="bg-white/90 rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent text-5xl font-mono font-bold mb-4">
                {Math.floor(processingTimer / 60)}:{(processingTimer % 60).toString().padStart(2, '0')}
              </div>
              
              {/* Улучшенный прогресс бар */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 h-4 rounded-full transition-all duration-1000 shadow-md relative overflow-hidden"
                  style={{ width: `${((60 - processingTimer) / 60) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium">{Math.round(((60 - processingTimer) / 60) * 100)}% завершено</p>
            </div>
            
            {/* Современные информационные блоки */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Icon name="Shield" size={24} className="text-white" />
                </div>
                <p className="text-base font-bold text-gray-800 mb-2">Безопасно</p>
                <p className="text-sm text-gray-600 font-medium">SSL защита</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Icon name="Zap" size={24} className="text-white" />
                </div>
                <p className="text-base font-bold text-gray-800 mb-2">Быстро</p>
                <p className="text-sm text-gray-600 font-medium">До 15 минут</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Icon name="Star" size={24} className="text-white" />
                </div>
                <p className="text-base font-bold text-gray-800 mb-2">Надёжно</p>
                <p className="text-sm text-gray-600 font-medium">Лицензия ЦБ</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingScreen;