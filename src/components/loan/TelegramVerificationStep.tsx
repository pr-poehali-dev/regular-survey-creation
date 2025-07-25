import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface TelegramVerificationStepProps {
  phoneNumber: string;
  onVerificationSuccess: () => void;
  onSkip: () => void;
}

const TelegramVerificationStep: React.FC<TelegramVerificationStepProps> = ({ 
  phoneNumber, 
  onVerificationSuccess, 
  onSkip 
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isCheckingTelegram, setIsCheckingTelegram] = useState(true);
  const [hasTelegram, setHasTelegram] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeTimer, setCodeTimer] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkTelegramAvailability();
  }, []);

  useEffect(() => {
    if (codeTimer > 0) {
      const timer = setTimeout(() => setCodeTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [codeTimer]);

  const checkTelegramAvailability = async () => {
    setIsCheckingTelegram(true);
    
    // Имитация проверки наличия Telegram у пользователя
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Случайно определяем наличие Telegram (в реальности это API запрос)
    const telegramExists = Math.random() > 0.3;
    setHasTelegram(telegramExists);
    setIsCheckingTelegram(false);

    if (telegramExists) {
      toast({
        title: "Telegram найден! 📱",
        description: "Мы можем отправить код подтверждения в ваш Telegram",
      });
    }
  };

  const sendTelegramCode = async () => {
    setIsSendingCode(true);
    
    // Имитация отправки кода в Telegram
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSendingCode(false);
    setCodeSent(true);
    setCodeTimer(60);
    
    toast({
      title: "Код отправлен! 📨",
      description: `Проверьте сообщения в Telegram на номере ${phoneNumber}`,
    });
  };

  const verifyCode = async () => {
    setIsVerifying(true);
    
    // Имитация проверки кода
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsVerifying(false);
    
    // Проверяем код (в реальности это API запрос)
    if (verificationCode === '1234') {
      toast({
        title: "Код подтвержден! ✅",
        description: "Заявка успешно верифицирована через Telegram",
      });
      onVerificationSuccess();
    } else {
      toast({
        title: "Неверный код ❌",
        description: "Попробуйте еще раз или запросите новый код",
        variant: "destructive"
      });
    }
  };

  if (isCheckingTelegram) {
    return (
      <div className="text-center space-y-4 py-8 animate-fade-in">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-lg font-bold text-gray-800">Проверяем Telegram</h3>
        <p className="text-gray-600">Ищем ваш аккаунт по номеру {phoneNumber}</p>
      </div>
    );
  }

  if (!hasTelegram) {
    return (
      <div className="text-center space-y-6 py-8 animate-fade-in">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <Icon name="MessageCircle" size={32} className="text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-800">Telegram не найден</h3>
          <p className="text-gray-600">
            На номере {phoneNumber} не найден аккаунт Telegram
          </p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Рекомендация</p>
              <p>Для дополнительной безопасности создайте аккаунт Telegram и привяжите этот номер</p>
            </div>
          </div>
        </div>

        <Button
          onClick={onSkip}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
        >
          Продолжить без Telegram
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="MessageCircle" size={32} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Подтверждение через Telegram</h3>
        <p className="text-gray-600 text-sm">
          Отправим код подтверждения в ваш Telegram {phoneNumber}
        </p>
      </div>

      {!codeSent ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Shield" size={20} className="text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Дополнительная защита</p>
                <p>Код подтверждения обеспечит безопасность вашей заявки</p>
              </div>
            </div>
          </div>

          <Button
            onClick={sendTelegramCode}
            disabled={isSendingCode}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3"
          >
            {isSendingCode ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Отправляем код...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Icon name="Send" size={16} />
                Отправить код в Telegram
              </div>
            )}
          </Button>

          <Button
            onClick={onSkip}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Пропустить проверку
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Код из Telegram *
            </Label>
            <Input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 4))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-lg font-mono"
              placeholder="1234"
              maxLength={4}
              required
            />
            <p className="text-xs text-gray-500 text-center">
              Введите 4-значный код из сообщения Telegram
            </p>
          </div>

          <Button
            onClick={verifyCode}
            disabled={verificationCode.length !== 4 || isVerifying}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3"
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Проверяем код...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Icon name="CheckCircle" size={16} />
                Подтвердить код
              </div>
            )}
          </Button>

          <div className="flex justify-between items-center">
            {codeTimer > 0 ? (
              <p className="text-sm text-gray-500">
                Повторная отправка через {codeTimer} сек
              </p>
            ) : (
              <Button
                onClick={sendTelegramCode}
                variant="outline"
                size="sm"
                disabled={isSendingCode}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Отправить код повторно
              </Button>
            )}
            
            <Button
              onClick={onSkip}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              Пропустить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelegramVerificationStep;