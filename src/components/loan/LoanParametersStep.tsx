import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface LoanParametersStepProps {
  loanAmount: number;
  loanTerm: number;
  onAmountChange: (amount: number) => void;
  onTermChange: (term: number) => void;
  onNext: () => void;
}

const LoanParametersStep: React.FC<LoanParametersStepProps> = ({
  loanAmount,
  loanTerm,
  onAmountChange,
  onTermChange,
  onNext
}) => {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ru-RU') + ' ₽';
  };

  const getAmountFromPercent = (percent: number) => {
    const min = 5000;
    const max = 100000;
    return Math.round(min + (max - min) * (percent / 100));
  };

  const getPercentFromAmount = (amount: number) => {
    const min = 5000;
    const max = 100000;
    return ((amount - min) / (max - min)) * 100;
  };

  const getTermFromPercent = (percent: number) => {
    const min = 7;
    const max = 30;
    return Math.round(min + (max - min) * (percent / 100));
  };

  const getPercentFromTerm = (term: number) => {
    const min = 7;
    const max = 30;
    return ((term - min) / (max - min)) * 100;
  };

  const handleAmountSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseInt(e.target.value);
    const amount = getAmountFromPercent(percent);
    onAmountChange(amount);
  };

  const handleTermSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseInt(e.target.value);
    const term = getTermFromPercent(percent);
    onTermChange(term);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Выберите параметры займа
        </h2>
        <p className="text-gray-600">
          Настройте сумму и срок под ваши потребности
        </p>
      </div>

      {/* Выбор суммы */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-lg font-semibold text-gray-900">
            Сумма займа
          </label>
          <div className="text-3xl font-bold text-green-600">
            {formatAmount(loanAmount)}
          </div>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={getPercentFromAmount(loanAmount)}
            onChange={handleAmountSliderChange}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #16a34a 0%, #16a34a ${getPercentFromAmount(loanAmount)}%, #e5e7eb ${getPercentFromAmount(loanAmount)}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>5 000 ₽</span>
            <span>100 000 ₽</span>
          </div>
        </div>
      </div>

      {/* Выбор срока */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-lg font-semibold text-gray-900">
            Срок займа
          </label>
          <div className="text-3xl font-bold text-blue-600">
            {loanTerm} дней
          </div>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={getPercentFromTerm(loanTerm)}
            onChange={handleTermSliderChange}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${getPercentFromTerm(loanTerm)}%, #e5e7eb ${getPercentFromTerm(loanTerm)}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>7 дней</span>
            <span>30 дней</span>
          </div>
        </div>
      </div>

      {/* Итоговая информация */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-3">
        <h3 className="font-semibold text-gray-900 mb-4">Параметры займа:</h3>
        <div className="flex justify-between">
          <span className="text-gray-600">Сумма займа:</span>
          <span className="font-semibold">{formatAmount(loanAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Срок займа:</span>
          <span className="font-semibold">{loanTerm} дней</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Ставка:</span>
          <span className="font-semibold">1% в день</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg">
          <span className="font-semibold text-gray-900">К возврату:</span>
          <span className="font-bold text-green-600">
            {formatAmount(loanAmount + (loanAmount * 0.01 * loanTerm))}
          </span>
        </div>
      </div>

      <Button
        onClick={onNext}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
      >
        <div className="flex items-center justify-center gap-2">
          <Icon name="ArrowRight" size={16} />
          Продолжить
        </div>
      </Button>
    </div>
  );
};

export default LoanParametersStep;