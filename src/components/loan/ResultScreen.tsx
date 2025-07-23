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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* 3D фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <Card className={`w-full max-w-md mx-4 relative shadow-2xl border-0 rounded-3xl backdrop-blur-lg transform animate-bounce-in ${
        isApproved 
          ? 'bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-400/20' 
          : 'bg-gradient-to-br from-red-500/10 to-rose-600/10 border-red-400/20'
      } border`} style={{
        boxShadow: isApproved 
          ? '0 25px 50px -12px rgba(34, 197, 94, 0.25), 0 0 0 1px rgba(34, 197, 94, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          : '0 25px 50px -12px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(239, 68, 68, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }}>
        {/* Блики и отражения */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        
        <CardContent className="p-12 text-center relative">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center relative ${
            isApproved ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-red-400 to-rose-600'
          }`} style={{
            boxShadow: isApproved 
              ? '0 8px 32px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
              : '0 8px 32px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
          }}>
            <Icon 
              name={isApproved ? "CheckCircle" : "XCircle"} 
              size={48} 
              className="text-white relative z-10" 
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>
          
          {isApproved ? (
            <>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                Заявка одобрена! 🎉
              </h2>
              <p className="text-white/80 mb-6 backdrop-blur-sm bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                Поздравляем! Ваша заявка успешно прошла проверку.
              </p>
              <div className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-green-400/20">
                <p className="text-green-400 font-semibold mb-2">
                  Ожидайте звонка специалиста
                </p>
                <p className="text-green-300 text-sm">
                  в течении 15 минут
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent mb-4">
                Заявка отклонена
              </h2>
              <p className="text-white/80 mb-6 backdrop-blur-sm bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                К сожалению, обнаружены задолженности в ФССП.
              </p>
              <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-red-400/20">
                <p className="text-red-400 font-semibold mb-2">
                  Причина отказа
                </p>
                <p className="text-red-300 text-sm">
                  Наличие исполнительных производств
                </p>
              </div>
            </>
          )}
          
          <Button 
            onClick={resetForm}
            className={`relative w-full py-3 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 overflow-hidden ${
              isApproved 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:shadow-2xl hover:shadow-green-500/50' 
                : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 hover:shadow-2xl hover:shadow-red-500/50'
            }`}
            style={{
              boxShadow: isApproved 
                ? '0 8px 32px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                : '0 8px 32px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
            <span className="relative z-10">Подать новую заявку</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultScreen;