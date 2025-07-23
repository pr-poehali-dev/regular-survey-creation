import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type SubmitStatus = 'approved' | 'rejected';

interface ResultScreenProps {
  submitStatus: SubmitStatus;
  resetForm: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ submitStatus, resetForm }) => {
  const isApproved = submitStatus === 'approved';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className={`w-full max-w-md mx-4 bg-white rounded-2xl shadow-lg border transform animate-bounce-in ${
        isApproved ? 'border-green-200' : 'border-red-200'
      }`}>
        
        <CardContent className="p-12 text-center">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isApproved ? 'bg-green-500' : 'bg-red-500'
          }`}>
            <Icon 
              name={isApproved ? "CheckCircle" : "XCircle"} 
              size={48} 
              className="text-white" 
            />
          </div>
          
          {isApproved ? (
            <>
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                Заявка одобрена! 🎉
              </h2>
              <p className="text-green-700 mb-6">
                Поздравляем! Ваша заявка успешно прошла проверку.
              </p>
              <div className="bg-green-100 rounded-2xl p-4 mb-6">
                <p className="text-green-800 font-semibold mb-2">
                  Ожидайте звонка специалиста
                </p>
                <p className="text-green-700 text-sm">
                  в течении 15 минут
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-red-800 mb-4">
                Заявка отклонена
              </h2>
              <p className="text-red-700 mb-6">
                К сожалению, обнаружены задолженности в ФССП.
              </p>
              <div className="bg-red-100 rounded-2xl p-4 mb-6">
                <p className="text-red-800 font-semibold mb-2">
                  Причина отказа
                </p>
                <p className="text-red-700 text-sm">
                  Наличие исполнительных производств
                </p>
              </div>
            </>
          )}
          
          <Button 
            onClick={resetForm}
            className={`w-full py-3 text-white font-semibold ${
              isApproved 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Подать новую заявку
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultScreen;