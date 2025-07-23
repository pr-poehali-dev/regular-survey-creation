import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ProcessingScreenProps {
  processingTimer: number;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ processingTimer }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-lg border border-gray-200">
        <CardContent className="p-12 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute inset-4 bg-blue-500 rounded-full flex items-center justify-center">
                <Icon name="FileCheck" size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Рассматриваем заявку
            </h2>
            <p className="text-gray-600 mb-6">
              Проверяем ваши данные и кредитную историю
            </p>
            <div className="text-3xl font-mono font-bold text-blue-600 mb-2">
              {Math.floor(processingTimer / 60)}:{(processingTimer % 60).toString().padStart(2, '0')}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((60 - processingTimer) / 60) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingScreen;