import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCountAnimation } from "@/hooks/useCountAnimation";
import ChatAssistant from "@/components/ChatAssistant";

interface FormData {
  // Личные данные
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  passportSeries: string;
  passportNumber: string;
  passportFile?: File;
  // Контактные данные
  email: string;
  phone: string;
  phoneCode: string;
  address: string;
  city: string;
  // Финансовые данные
  income: string;
  workplace: string;
  loanAmount: number;
  loanTerm: number;
}

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    passportSeries: '',
    passportNumber: '',
    email: '',
    phone: '',
    phoneCode: '',
    address: '',
    city: '',
    income: '',
    workplace: '',
    loanAmount: 50000,
    loanTerm: 30
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTimer, setProcessingTimer] = useState(60);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'processing' | 'approved' | 'rejected'>('idle');
  const [hasDebts, setHasDebts] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeTimer, setCodeTimer] = useState(0);
  const [showCodeInput, setShowCodeInput] = useState(false);
  
  const { toast } = useToast();

  // Таймер обработки заявки
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing && processingTimer > 0) {
      interval = setInterval(() => {
        setProcessingTimer(prev => prev - 1);
      }, 1000);
    } else if (processingTimer === 0) {
      // Имитация проверки ФССП
      const mockHasDebts = Math.random() < 0.3; // 30% шанс долгов
      setHasDebts(mockHasDebts);
      setSubmitStatus(mockHasDebts ? 'rejected' : 'approved');
      setIsProcessing(false);
    }
    return () => clearInterval(interval);
  }, [isProcessing, processingTimer]);

  // Таймер для кода подтверждения
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (codeTimer > 0) {
      interval = setInterval(() => {
        setCodeTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [codeTimer]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Генерация кода подтверждения
  const generatePhoneCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    setShowCodeInput(true);
    setCodeTimer(60);
    
    // Имитация отправки SMS
    toast({
      title: "Код отправлен!",
      description: `SMS код: ${code} (для демо)`,
      duration: 5000
    });
  };

  // Проверка кода
  const verifyPhoneCode = () => {
    if (formData.phoneCode === generatedCode) {
      setIsPhoneVerified(true);
      setShowCodeInput(false);
      toast({
        title: "Телефон подтвержден!",
        description: "Номер успешно верифицирован",
        variant: "default"
      });
    } else {
      toast({
        title: "Неверный код",
        description: "Проверьте правильность введенного кода",
        variant: "destructive"
      });
    }
  };

  // Расчет переплаты и ежемесячного платежа
  const calculateLoan = () => {
    const rate = 0.02; // 2% в день
    const totalAmount = formData.loanAmount * (1 + rate * formData.loanTerm);
    const overpayment = totalAmount - formData.loanAmount;
    const dailyPayment = totalAmount / formData.loanTerm;
    
    return { totalAmount, overpayment, dailyPayment };
  };

  // Анимированные значения для цифр
  const { totalAmount, overpayment, dailyPayment } = calculateLoan();
  const animatedTotalAmount = useCountAnimation(Math.round(totalAmount));
  const animatedOverpayment = useCountAnimation(Math.round(overpayment));
  const animatedDailyPayment = useCountAnimation(Math.round(dailyPayment));
  const animatedLoanAmount = useCountAnimation(formData.loanAmount);

  const handleFileUpload = (file: File | undefined) => {
    setFormData(prev => ({ ...prev, passportFile: file }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.middleName && formData.birthDate);
      case 2:
        return !!(formData.passportSeries && formData.passportNumber && formData.passportFile);
      case 3:
        return !!(formData.email && formData.phone && isPhoneVerified && formData.address && formData.city);
      case 4:
        return !!(formData.income && formData.workplace && formData.loanAmount > 0);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast({
        title: "Заполните все поля",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(4)) {
      toast({
        title: "Заполните все поля",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('processing');
    setIsProcessing(true);
    setProcessingTimer(60);

    // Отправка данных в Bitrix24
    try {
      await sendToBitrix24(formData);
    } catch (error) {
      console.error('Ошибка отправки:', error);
    }

    setIsSubmitting(false);
  };

  const sendToBitrix24 = async (data: FormData) => {
    const webhookUrl = 'https://b24-0vo5vw.bitrix24.ru/rest/1/q5be4cfha7ph0li8/';
    
    const response = await fetch(`${webhookUrl}crm.lead.add.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          TITLE: `Заявка МФО: ${data.firstName} ${data.lastName}`,
          NAME: data.firstName,
          LAST_NAME: data.lastName,
          EMAIL: [{ VALUE: data.email, VALUE_TYPE: 'WORK' }],
          PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
          ADDRESS: data.address,
          COMMENTS: `
            ФИО: ${data.lastName} ${data.firstName} ${data.middleName}
            Дата рождения: ${data.birthDate}
            Паспорт: ${data.passportSeries} ${data.passportNumber}
            Город: ${data.city}
            Место работы: ${data.workplace}
            Доход: ${data.income}
            Сумма займа: ${data.loanAmount}
          `,
          SOURCE_ID: 'WEB',
          SOURCE_DESCRIPTION: 'Заявка МФО с сайта'
        }
      })
    });

    if (!response.ok) {
      throw new Error('Ошибка отправки данных');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      middleName: '',
      birthDate: '',
      passportSeries: '',
      passportNumber: '',
      email: '',
      phone: '',
      phoneCode: '',
      address: '',
      city: '',
      income: '',
      workplace: '',
      loanAmount: 50000,
      loanTerm: 30
    });
    setCurrentStep(1);
    setSubmitStatus('idle');
    setProcessingTimer(60);
    setIsPhoneVerified(false);
    setShowCodeInput(false);
    setCodeTimer(0);
  };

  // Экран обработки заявки
  if (submitStatus === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Card className="w-full max-w-md mx-4 shadow-2xl border-0 rounded-3xl bg-white/80 backdrop-blur-sm">
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
  }

  // Экран результата
  if (submitStatus === 'approved' || submitStatus === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Card className={`w-full max-w-md mx-4 shadow-2xl border-0 rounded-3xl backdrop-blur-sm transform animate-bounce-in ${
          submitStatus === 'approved' 
            ? 'bg-gradient-to-br from-green-50 to-emerald-100' 
            : 'bg-gradient-to-br from-red-50 to-rose-100'
        }`}>
          <CardContent className="p-12 text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              submitStatus === 'approved' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <Icon 
                name={submitStatus === 'approved' ? "CheckCircle" : "XCircle"} 
                size={48} 
                className="text-white" 
              />
            </div>
            
            {submitStatus === 'approved' ? (
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
              className={`w-full py-3 rounded-full text-white font-semibold ${
                submitStatus === 'approved' 
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-8 relative overflow-hidden">
      {/* 3D фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <form onSubmit={handleSubmit}>
          {/* 3D Прогресс-бар */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className={`relative flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all duration-500 transform ${
                  currentStep >= step 
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-2xl shadow-blue-500/50 scale-125 rotate-3' 
                    : 'bg-gradient-to-br from-gray-600 to-gray-800 text-gray-300 shadow-lg'
                } hover:scale-110`} style={{
                  boxShadow: currentStep >= step 
                    ? '0 8px 32px rgba(59, 130, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                    : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                }}>
                  <span className="relative z-10">{step}</span>
                  {currentStep >= step && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out relative"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Логотип по центру */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-8 py-4 shadow-xl border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Icon name="Banknote" size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-800">Деньги в Дом</h1>
                <p className="text-sm text-gray-500">Быстрые займы онлайн</p>
              </div>
            </div>
          </div>

          <Card className="relative shadow-2xl border-0 rounded-3xl backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 transform transition-all duration-500 hover:scale-[1.02]" style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}>
            {/* Блики и отражения */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            
            <CardHeader className="text-center pb-6 relative">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 drop-shadow-lg flex items-center justify-center gap-3">
                <Icon name="CreditCard" size={32} className="text-cyan-400" />
                Заявка на займ
              </CardTitle>
              <p className="text-white/80 text-sm backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 inline-block border border-white/20">
                {currentStep === 1 && "Личные данные"}
                {currentStep === 2 && "Документы"}
                {currentStep === 3 && "Контактная информация"}
                {currentStep === 4 && "Финансовая информация"}
              </p>
            </CardHeader>

            <CardContent className="p-8 space-y-6 relative">
              {/* Шаг 1: Личные данные */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-white/90 mb-2 block">Имя *</Label>
                      <div className="relative">
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:bg-white/20 transition-all duration-300 transform focus:scale-105 focus:shadow-2xl focus:shadow-blue-500/25 h-12"
                          style={{
                            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                          placeholder="Введите имя"
                          required
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-white/90 mb-2 block">Фамилия *</Label>
                      <div className="relative">
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:bg-white/20 transition-all duration-300 transform focus:scale-105 focus:shadow-2xl focus:shadow-blue-500/25 h-12"
                          style={{
                            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                          placeholder="Введите фамилию"
                          required
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Отчество *</Label>
                    <Input
                      value={formData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                      className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105"
                      placeholder="Введите отчество"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-white/90 mb-2 block">Дата рождения *</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        className="rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:bg-white/20 transition-all duration-300 transform focus:scale-105 focus:shadow-2xl focus:shadow-blue-500/25 h-12"
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                        required
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Шаг 2: Документы */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Серия паспорта *</Label>
                      <Input
                        value={formData.passportSeries}
                        onChange={(e) => handleInputChange('passportSeries', e.target.value)}
                        className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105"
                        placeholder="1234"
                        maxLength={4}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Номер паспорта *</Label>
                      <Input
                        value={formData.passportNumber}
                        onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                        className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105"
                        placeholder="567890"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Фото паспорта *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                      {/* Скрытые инпуты для разных источников */}
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleFileUpload(e.target.files?.[0])}
                        className="hidden"
                        id="passport-camera"
                        required
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files?.[0])}
                        className="hidden"
                        id="passport-gallery"
                        required
                      />
                      
                      {formData.passportFile ? (
                        <div className="space-y-4">
                          <div className="relative w-32 h-24 mx-auto">
                            <img 
                              src={URL.createObjectURL(formData.passportFile)} 
                              alt="Паспорт" 
                              className="w-full h-full object-cover rounded-lg border-2 border-green-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleFileUpload(undefined)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                          <p className="text-green-600 font-medium">{formData.passportFile.name}</p>
                          <p className="text-xs text-gray-500">Файл загружен успешно</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Icon name="FileImage" size={32} className="mx-auto text-gray-400" />
                          <p className="text-gray-600 font-medium">Загрузите фото паспорта</p>
                          
                          {/* Кнопки для выбора источника */}
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <label htmlFor="passport-camera" className="cursor-pointer">
                              <div className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                                <Icon name="Camera" size={16} />
                                <span className="text-sm font-medium">Камера</span>
                              </div>
                            </label>
                            
                            <label htmlFor="passport-gallery" className="cursor-pointer">
                              <div className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                                <Icon name="Image" size={16} />
                                <span className="text-sm font-medium">Галерея</span>
                              </div>
                            </label>
                          </div>
                          
                          <p className="text-xs text-gray-400">JPG, PNG до 10МБ</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Шаг 3: Контакты */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Email *</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105"
                        placeholder="example@mail.ru"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Телефон *</Label>
                      <div className="flex gap-2">
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105 flex-1"
                          placeholder="+7 (999) 123-45-67"
                          required
                          disabled={isPhoneVerified}
                        />
                        {!isPhoneVerified && formData.phone && (
                          <Button
                            type="button"
                            onClick={generatePhoneCode}
                            disabled={codeTimer > 0}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 text-sm"
                          >
                            {codeTimer > 0 ? `${codeTimer}s` : 'Код'}
                          </Button>
                        )}
                        {isPhoneVerified && (
                          <div className="flex items-center px-3 bg-green-100 rounded-xl">
                            <Icon name="CheckCircle" size={16} className="text-green-600" />
                          </div>
                        )}
                      </div>
                      
                      {/* Поле для ввода кода */}
                      {showCodeInput && (
                        <div className="flex gap-2 mt-3">
                          <Input
                            value={formData.phoneCode}
                            onChange={(e) => handleInputChange('phoneCode', e.target.value)}
                            className="rounded-xl border-2 focus:border-green-500 transition-all duration-300 flex-1"
                            placeholder="Введите код из SMS"
                            maxLength={4}
                          />
                          <Button
                            type="button"
                            onClick={verifyPhoneCode}
                            className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4"
                          >
                            <Icon name="Check" size={16} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Адрес проживания *</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105"
                      placeholder="Улица, дом, квартира"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Город *</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105"
                      placeholder="Введите город"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Шаг 4: Финансы */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Калькулятор займа */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Icon name="Calculator" size={20} />
                      Калькулятор займа
                    </h3>
                    
                    {/* Сумма займа */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-semibold text-gray-700">Сумма займа</Label>
                        <span className="text-lg font-bold text-blue-600">{animatedLoanAmount.toLocaleString()} ₽</span>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max="500000"
                        step="5000"
                        value={formData.loanAmount}
                        onChange={(e) => handleInputChange('loanAmount', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>5 000 ₽</span>
                        <span>500 000 ₽</span>
                      </div>
                    </div>
                    
                    {/* Срок займа */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-semibold text-gray-700">Срок займа</Label>
                        <span className="text-lg font-bold text-purple-600">{formData.loanTerm} дней</span>
                      </div>
                      <input
                        type="range"
                        min="7"
                        max="365"
                        step="1"
                        value={formData.loanTerm}
                        onChange={(e) => handleInputChange('loanTerm', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>7 дней</span>
                        <span>365 дней</span>
                      </div>
                    </div>
                    
                    {/* Расчет */}
                    <div className="bg-white rounded-xl p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">К возврату:</span>
                        <span className="font-bold text-green-600">{animatedTotalAmount.toLocaleString()} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Переплата:</span>
                        <span className="font-bold text-orange-600">{animatedOverpayment.toLocaleString()} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Платеж в день:</span>
                        <span className="font-bold text-blue-600">{animatedDailyPayment.toLocaleString()} ₽</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Место работы *</Label>
                    <Input
                      value={formData.workplace}
                      onChange={(e) => handleInputChange('workplace', e.target.value)}
                      className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105"
                      placeholder="Название организации"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Ежемесячный доход *</Label>
                    <Input
                      type="number"
                      value={formData.income}
                      onChange={(e) => handleInputChange('income', e.target.value)}
                      className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105"
                      placeholder="50000"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Навигация */}
              <div className="flex justify-between pt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="rounded-full px-8 py-3 border-2 hover:bg-gray-50 transition-all duration-300"
                  >
                    <Icon name="ChevronLeft" size={16} className="mr-2" />
                    Назад
                  </Button>
                )}
                
                <div className="ml-auto">
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8 py-3 transition-all duration-300 transform hover:scale-105"
                    >
                      Далее
                      <Icon name="ChevronRight" size={16} className="ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white rounded-full px-8 py-3 transition-all duration-300 transform hover:scale-105"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Отправляем...
                        </div>
                      ) : (
                        <>
                          <Icon name="Send" size={16} className="mr-2" />
                          Подать заявку
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
      
      {/* Чат-помощник */}
      <ChatAssistant />
    </div>
  );
};

export default Index;