import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ProcessingScreenProps {
  processingTimer: number;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ processingTimer }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* 3D фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <Card className="w-full max-w-md mx-4 relative shadow-2xl border-0 rounded-3xl backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20" style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }}>
        {/* Блики и отражения */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        
        <CardContent className="p-12 text-center relative">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 border-4 border-blue-400 rounded-full animate-spin border-t-transparent" style={{
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
              }}></div>
              <div className="absolute inset-4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center" style={{
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
              }}>
                <Icon name="FileCheck" size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Рассматриваем заявку
            </h2>
            <p className="text-white/70 mb-6 backdrop-blur-sm bg-white/5 rounded-full px-4 py-2 inline-block border border-white/10">
              Проверяем ваши данные и кредитную историю
            </p>
            <div className="text-3xl font-mono font-bold text-cyan-400 mb-2 drop-shadow-lg">
              {Math.floor(processingTimer / 60)}:{(processingTimer % 60).toString().padStart(2, '0')}
            </div>
            <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${((60 - processingTimer) / 60) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingScreen;