import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface ApprovedLoanScreenProps {
  resetForm: () => void;
}

const ApprovedLoanScreen: React.FC<ApprovedLoanScreenProps> = ({ resetForm }) => {
  const [loanAmount, setLoanAmount] = useState([50000]);
  const [loanTerm, setLoanTerm] = useState([30]);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);
  
  // Рассчитанные данные одобренного займа
  const maxAmount = 300000;
  const minAmount = 5000;
  const maxTerm = 365;
  const minTerm = 7;
  
  const monthlyPayment = Math.round((loanAmount[0] * 1.02) / (loanTerm[0] / 30));
  const totalAmount = Math.round(loanAmount[0] * 1.02);
  const dailyRate = ((totalAmount - loanAmount[0]) / loanAmount[0] / loanTerm[0] * 100).toFixed(2);

  // Анимация прогресса перевода
  useEffect(() => {
    if (isTransferring) {
      const interval = setInterval(() => {
        setTransferProgress(prev => {
          if (prev >= 100) {
            setIsTransferring(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isTransferring]);

  const handleTransfer = () => {
    setIsTransferring(true);
    setTransferProgress(0);
  };

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <Icon name="CheckCircle" size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            🎉 Заявка одобрена!
          </h1>
          <p className="text-lg text-gray-600">
            Настройте параметры займа и получите деньги
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основная карточка с параметрами займа */}
          <Card className="lg:col-span-2 shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
              <CardTitle className="text-2xl text-green-800 flex items-center gap-3">
                <Icon name="Banknote" size={28} className="text-green-600" />
                Параметры займа
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* Сумма займа */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg font-semibold text-gray-800">
                    💰 Сумма займа
                  </label>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {loanAmount[0].toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                </div>
                <Slider
                  value={loanAmount}
                  onValueChange={setLoanAmount}
                  max={maxAmount}
                  min={minAmount}
                  step={5000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{minAmount.toLocaleString('ru-RU')} ₽</span>
                  <span>{maxAmount.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              {/* Срок займа */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg font-semibold text-gray-800">
                    📅 Срок займа
                  </label>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {loanTerm[0]} дней
                    </div>
                  </div>
                </div>
                <Slider
                  value={loanTerm}
                  onValueChange={setLoanTerm}
                  max={maxTerm}
                  min={minTerm}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{minTerm} дней</span>
                  <span>{maxTerm} дней</span>
                </div>
              </div>

              {/* Расчеты */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="Calculator" size={20} className="text-blue-600" />
                  Расчет займа
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl border">
                    <div className="text-sm text-gray-500 mb-1">Ежемесячный платеж</div>
                    <div className="text-xl font-bold text-gray-800">
                      {monthlyPayment.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border">
                    <div className="text-sm text-gray-500 mb-1">Общая сумма к возврату</div>
                    <div className="text-xl font-bold text-gray-800">
                      {totalAmount.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border col-span-2">
                    <div className="text-sm text-gray-500 mb-1">Ставка в день</div>
                    <div className="text-xl font-bold text-green-600">
                      {dailyRate}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Кнопка зачисления */}
              {!isTransferring && transferProgress < 100 ? (
                <Button 
                  onClick={handleTransfer}
                  className="w-full py-6 text-white font-bold text-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-2xl shadow-lg transform hover:scale-105 transition-all"
                >
                  <Icon name="CreditCard" size={24} className="mr-3" />
                  Зачислить займ на карту
                </Button>
              ) : transferProgress < 100 ? (
                <div className="w-full">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 px-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-center mb-4">
                      <div className="animate-spin mr-3">
                        <Icon name="Loader2" size={24} className="text-white" />
                      </div>
                      <span className="text-xl font-bold">
                        Перевод денежных средств...
                      </span>
                    </div>
                    
                    {/* Анимированная шкала перевода */}
                    <div className="bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                        style={{ width: `${transferProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm mt-2 text-white/90">
                      <span>Обработка...</span>
                      <span>{transferProgress}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-6 px-6 rounded-2xl shadow-lg text-center">
                    <Icon name="CheckCircle2" size={32} className="mx-auto mb-3 text-green-200" />
                    <div className="text-xl font-bold mb-2">
                      ✅ Деньги успешно переведены!
                    </div>
                    <div className="text-green-200">
                      {loanAmount[0].toLocaleString('ru-RU')} ₽ зачислено на вашу карту
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Боковая панель с информацией */}
          <div className="space-y-6">
            {/* Карточка с номером */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="CreditCard" size={24} className="text-blue-200" />
                  <h3 className="font-bold text-lg">Ваша карта</h3>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="font-mono text-lg tracking-wider mb-2">
                    **** **** **** 4521
                  </div>
                  <div className="flex justify-between text-sm text-blue-200">
                    <span>12/29</span>
                    <span>VISA</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Условия займа */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="FileText" size={20} className="text-blue-600" />
                  Условия займа
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Icon name="Check" size={16} className="text-green-600" />
                    <span>Без скрытых комиссий</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Icon name="Check" size={16} className="text-green-600" />
                    <span>Досрочное погашение без штрафа</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Icon name="Check" size={16} className="text-green-600" />
                    <span>Мгновенное зачисление</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Icon name="Check" size={16} className="text-green-600" />
                    <span>24/7 поддержка</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Поддержка */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Headphones" size={24} className="text-purple-200" />
                  <h3 className="font-bold">Поддержка 24/7</h3>
                </div>
                <p className="text-purple-100 text-sm mb-3">
                  Есть вопросы? Мы всегда на связи!
                </p>
                <div className="text-lg font-bold">
                  📞 +7(800) 2727-28-28
                </div>
              </CardContent>
            </Card>

            {/* Кнопка новой заявки */}
            <Button 
              onClick={resetForm}
              variant="outline"
              className="w-full py-3 border-2 border-gray-300 hover:bg-gray-50 font-semibold rounded-xl"
            >
              Подать новую заявку
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedLoanScreen;