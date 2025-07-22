import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
  address: string;
  city: string;
  // Финансовые данные
  income: string;
  workplace: string;
  loanAmount: string;
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
    address: '',
    city: '',
    income: '',
    workplace: '',
    loanAmount: ''
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTimer, setProcessingTimer] = useState(60);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'processing' | 'approved' | 'rejected'>('idle');
  const [hasDebts, setHasDebts] = useState(false);
  
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
        return !!(formData.email && formData.phone && formData.address && formData.city);
      case 4:
        return !!(formData.income && formData.workplace && formData.loanAmount);
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
      address: '',
      city: '',
      income: '',
      workplace: '',
      loanAmount: ''
    });
    setCurrentStep(1);
    setSubmitStatus('idle');
    setProcessingTimer(60);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <form onSubmit={handleSubmit}>
          {/* Прогресс-бар */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-blue-500 text-white shadow-lg transform scale-110' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card className="shadow-2xl border-0 rounded-3xl bg-white/80 backdrop-blur-sm transform transition-all duration-500 hover:scale-[1.02]">
            <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-3xl">
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
                <Icon name="CreditCard" size={32} />
                Заявка на займ
              </CardTitle>
              <p className="text-blue-100 mt-2">
                {currentStep === 1 && "Личные данные"}
                {currentStep === 2 && "Документы"}
                {currentStep === 3 && "Контактная информация"}
                {currentStep === 4 && "Финансовая информация"}
              </p>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              {/* Шаг 1: Личные данные */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Имя *</Label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105"
                        placeholder="Введите имя"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Фамилия *</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105"
                        placeholder="Введите фамилию"
                        required
                      />
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
                    <Label className="text-sm font-semibold text-gray-700">Дата рождения *</Label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105"
                      required
                    />
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
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files?.[0])}
                        className="hidden"
                        id="passport-upload"
                        required
                      />
                      <label htmlFor="passport-upload" className="cursor-pointer">
                        <Icon name="Upload" size={32} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-600">
                          {formData.passportFile ? formData.passportFile.name : "Нажмите для загрузки фото"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Поддерживаются JPG, PNG</p>
                      </label>
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
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105"
                        placeholder="+7 (999) 123-45-67"
                        required
                      />
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
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Желаемая сумма займа *</Label>
                    <Input
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                      className="rounded-xl border-2 focus:border-blue-500 transition-all duration-300 transform focus:scale-105"
                      placeholder="100000"
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
    </div>
  );
};

export default Index;