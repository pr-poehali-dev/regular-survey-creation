import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я помощник по займам. Выберите интересующий вопрос из списка ниже или задайте свой:',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    '💰 Какая процентная ставка?',
    '⏰ Какие сроки займа?',
    '💸 Какая минимальная и максимальная сумма?',
    '📄 Какие документы нужны?',
    '⚡ Как быстро одобряют заявку?',
    '💳 Как вернуть займ?',
    '📞 Контакты поддержки'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('процент') || message.includes('ставка')) {
      return 'Наша процентная ставка составляет 1% в день. Это одна из самых выгодных ставок на рынке микрозаймов!';
    }
    
    if (message.includes('срок') || message.includes('период')) {
      return 'Вы можете взять займ на срок от 7 до 365 дней. Выберите удобный для вас период погашения!';
    }
    
    if (message.includes('сумма') || message.includes('размер')) {
      return 'Минимальная сумма займа - 5 000 ₽, максимальная - 500 000 ₽. Выберите нужную сумму в калькуляторе!';
    }
    
    if (message.includes('документ') || message.includes('паспорт')) {
      return 'Для оформления займа нужен только паспорт РФ. Никаких справок о доходах и поручителей!';
    }
    
    if (message.includes('одобрение') || message.includes('решение')) {
      return 'Решение по заявке принимается мгновенно! Деньги поступают на карту в течение 15 минут.';
    }
    
    if (message.includes('возврат') || message.includes('погашение')) {
      return 'Вернуть займ можно досрочно без комиссий или в установленный срок. Способы погашения: через сайт, банковский перевод или в терминалах.';
    }
    
    if (message.includes('привет') || message.includes('здравствуй')) {
      return 'Добро пожаловать! Готов ответить на все ваши вопросы о займах. Что вас интересует?';
    }
    
    if (message.includes('контакт') || message.includes('поддержк') || message.includes('телефон')) {
      return 'Служба поддержки работает круглосуточно:\n📞 8-800-555-0123 (бесплатно)\n📧 support@zaim.ru\n💬 Онлайн-чат на сайте';
    }
    
    return 'Спасибо за ваш вопрос! Наши специалисты работают над улучшением сервиса. Если у вас срочный вопрос, обратитесь к нашему оператору по телефону 8-800-555-0123.';
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setShowQuickQuestions(false);

    // Имитация задержки ответа бота
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(textToSend),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickQuestion = (question: string) => {
    const cleanQuestion = question.replace(/^[💰⏰💸📄⚡💳📞]\s/, '');
    handleSendMessage(cleanQuestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Плавающая кнопка чата */}
      <div className="fixed left-6 bottom-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          }`}
        >
          <Icon 
            name={isOpen ? "X" : "MessageCircle"} 
            size={24} 
            className="text-white"
          />
        </Button>
      </div>

      {/* Панель чата */}
      <div className={`fixed left-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Заголовок чата */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Icon name="Bot" size={20} />
          </div>
          <div>
            <h3 className="font-bold">Помощник по займам</h3>
            <p className="text-sm opacity-90">Онлайн • Готов помочь</p>
          </div>
        </div>

        {/* Сообщения */}
        <div className="flex-1 overflow-y-auto p-4 h-[calc(100vh-140px)] space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white ml-4'
                    : 'bg-gray-100 text-gray-800 mr-4'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {/* Быстрые вопросы */}
          {showQuickQuestions && messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 text-center">Популярные вопросы:</p>
              <div className="grid grid-cols-1 gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors duration-200 text-sm text-gray-700 hover:text-blue-700"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Индикатор печати */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-2 mr-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Поле ввода */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Задайте вопрос..."
              className="flex-1 rounded-xl border-2 focus:border-blue-500"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              <Icon name="Send" size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Затемнение фона */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ChatAssistant;