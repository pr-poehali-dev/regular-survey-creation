import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Здравствуйте! Я помогу вам с займом в КПК. Что вас интересует?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    "Условия займа",
    "Членский взнос",
    "Документы",
    "Сроки рассмотрения",
    "Процентная ставка"
  ];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userText: string): string => {
    const text = userText.toLowerCase();
    
    if (text.includes('условия') || text.includes('займ')) {
      return "В КПК 'Деньги в Дом' займы предоставляются под членский взнос 340₽/день. Сумма от 1 000 до 500 000₽, срок до 365 дней.";
    }
    
    if (text.includes('взнос') || text.includes('340')) {
      return "Членский взнос составляет 340₽ в день. Это фиксированная сумма, которая не зависит от суммы займа.";
    }
    
    if (text.includes('документ')) {
      return "Для займа нужны: паспорт, СНИЛС, справка о доходах. Все документы можно загрузить прямо в анкете.";
    }
    
    if (text.includes('срок') || text.includes('время')) {
      return "Рассмотрение заявки займет до 15 минут. После одобрения деньги поступят на карту в течение 5 минут.";
    }
    
    if (text.includes('процент') || text.includes('ставка')) {
      return "В КПК нет процентной ставки. Вместо этого действует членский взнос 340₽/день, что соответствует всем требованиям законодательства.";
    }
    
    if (text.includes('телефон') || text.includes('звонок')) {
      return "Телефон поддержки: +7(800) 2727-28-28 (бесплатно). Работаем круглосуточно без выходных.";
    }
    
    return "Спасибо за ваш вопрос! Для получения подробной консультации звоните +7(800) 2727-28-28 или оставьте заявку на сайте.";
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
        >
          <Icon name="MessageCircle" size={24} className="text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 z-50 animate-in slide-in-from-bottom-2">
      <Card className="h-full bg-white/95 backdrop-blur-sm shadow-2xl border border-white/30">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Headphones" size={20} className="text-white" />
              <CardTitle className="text-sm font-semibold">
                Онлайн поддержка КПК
              </CardTitle>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 w-6 h-6 p-0"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full flex flex-col">
          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-64">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-2 rounded-lg text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Быстрые вопросы */}
          <div className="p-2 border-t">
            <div className="text-xs text-gray-600 mb-2">Частые вопросы:</div>
            <div className="flex flex-wrap gap-1">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  onClick={() => sendMessage(question)}
                  variant="outline"
                  size="sm"
                  className="text-xs h-6 px-2 border-gray-300 hover:bg-blue-50"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Поле ввода */}
          <div className="p-3 border-t bg-gray-50">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                placeholder="Напишите ваш вопрос..."
                className="text-sm"
              />
              <Button
                onClick={() => sendMessage(inputMessage)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 px-3"
              >
                <Icon name="Send" size={16} className="text-white" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              Или звоните: +7(800) 2727-28-28
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportChat;