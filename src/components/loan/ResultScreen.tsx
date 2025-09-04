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

  const partnerOffers = [
    {
      id: 1,
      title: '💳 Карты с кэшбэком',
      description: 'Получите до 10% кэшбэка на покупки',
      image: '/img/94c07f6c-0f00-4705-9e65-a4b9ae70e48a.jpg',
      benefits: ['Без годового обслуживания', 'Кэшбэк до 10%', 'Льготный период 120 дней'],
      buttonText: 'Оформить карту',
      color: 'blue'
    },
    {
      id: 2,
      title: '🚗 Автокредит',
      description: 'Кредит на авто от 8.5% годовых',
      image: '/img/2811bda3-9b35-40ec-91b0-19351ab622b2.jpg',
      benefits: ['Ставка от 8.5%', 'Срок до 7 лет', 'Без первоначального взноса'],
      buttonText: 'Получить авто',
      color: 'indigo'
    },
    {
      id: 3,
      title: '🏠 Ипотека',
      description: 'Ипотечный кредит от 6.9% годовых',
      image: '/img/4a9654e1-0787-4911-b2ee-73f45c421623.jpg',
      benefits: ['Ставка от 6.9%', 'Первоначальный взнос от 10%', 'Срок до 30 лет'],
      buttonText: 'Купить дом',
      color: 'green'
    }
  ];

  return (
    <div 
      className="min-h-screen py-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('/img/8f60907b-2d93-41c9-848d-34fe66f9edee.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Затемняющий оверлей */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Основная карточка результата */}
        <Card className={`w-full max-w-lg mx-auto mb-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border transform animate-bounce-in ${
          isApproved ? 'border-green-200' : 'border-red-200'
        }`}>
          <CardContent className="p-8 sm:p-12 text-center">
            <div className={`w-28 h-28 mx-auto mb-8 rounded-full flex items-center justify-center shadow-lg transform ${
              isApproved ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}>
              <Icon 
                name={isApproved ? "CheckCircle" : "XCircle"} 
                size={56} 
                className="text-white" 
              />
            </div>
            
            {isApproved ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">
                  🎉 Заявка в КПК одобрена!
                </h2>
                <p className="text-lg text-green-700 mb-6 font-medium">
                  Поздравляем! Вы приняты в КПК "Деньги в Дом".
                </p>
                
                {/* Номер карты */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 mb-6 text-white">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Icon name="CreditCard" size={28} className="text-white" />
                    <p className="font-bold text-xl">
                      Ваша карта готова!
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-lg font-mono tracking-wider mb-2">
                      **** **** **** 4521
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Действительна до: 12/29</span>
                      <span>VISA</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-100 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Icon name="Phone" size={24} className="text-green-600" />
                    <p className="text-green-800 font-bold text-lg">
                      Ожидайте звонка специалиста
                    </p>
                  </div>
                  <p className="text-green-700 text-base">
                    в течении 15 минут для получения карты
                  </p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-red-800 mb-4">
                  😔 Заявка отклонена
                </h2>
                <p className="text-lg text-red-700 mb-6 font-medium">
                  К сожалению, ваша заявка не была одобрена.
                </p>
                <div className="bg-red-100 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Icon name="AlertCircle" size={24} className="text-red-600" />
                    <p className="text-red-800 font-bold text-lg">
                      Возможные причины
                    </p>
                  </div>
                  <p className="text-red-700 text-base">
                    Неподходящая кредитная история, текущие обязательства или превышен лимит долга ФССП (более 30 000 ₽)
                  </p>
                </div>
              </>
            )}
            
            <Button 
              onClick={resetForm}
              className={`w-full py-4 text-white font-semibold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all ${
                isApproved 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              }`}
            >
              {isApproved ? 'Подать новую заявку' : 'Попробовать снова'}
            </Button>
          </CardContent>
        </Card>

        {/* Партнёрские предложения (показываем только при отказе) */}
        {!isApproved && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                🎁 Эксклюзивные предложения партнёров
              </h3>
              <p className="text-lg text-white/90 font-medium">
                Не расстраивайтесь! У нас есть другие выгодные решения для вас
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {partnerOffers.map((offer) => (
                <Card key={offer.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 hover:transform hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={offer.image} 
                      alt={offer.title}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-bold text-gray-800">ТОП</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {offer.title}
                    </h4>
                    <p className="text-gray-700 mb-4 font-medium">
                      {offer.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {offer.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Icon name="Check" size={16} className={`text-${offer.color}-600`} />
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full py-3 font-semibold rounded-xl shadow-lg bg-gradient-to-r from-${offer.color}-600 to-${offer.color}-700 hover:from-${offer.color}-700 hover:to-${offer.color}-800 text-white transform hover:scale-105 transition-all`}
                    >
                      {offer.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 inline-block">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Icon name="Headphones" size={24} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Нужна консультация?</p>
                      <p className="text-gray-700">+7(800) 2727-28-28 (бесплатно)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;