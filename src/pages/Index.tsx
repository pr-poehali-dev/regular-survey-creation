import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import StepProgressBar from "@/components/loan/StepProgressBar";
import FormSteps, { FormData } from "@/components/loan/FormSteps";
import LoanParametersStep from "@/components/loan/LoanParametersStep";
import ProgressBar from "@/components/loan/ProgressBar";
import ProcessingScreen from "@/components/loan/ProcessingScreen";
import ResultScreen from "@/components/loan/ResultScreen";
import CardBindingStep from "@/components/loan/CardBindingStep";
import SupportChat from "@/components/support/SupportChat";


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
    const membershipFeePerDay = 340; // Членский взнос КПК 340₽/день
    
    const totalMembershipFees = membershipFeePerDay * days;
    const totalAmount = principal + totalMembershipFees;
    const dailyPayment = totalAmount / days;

    return {
      totalAmount: Math.round(totalAmount),
      overpayment: Math.round(totalMembershipFees),
      dailyPayment: dailyPayment,
      membershipFeePerDay
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
      case 1: return "Параметры займа КПК";
      case 2: return "Данные заёмщика";
      case 3: return "Документы";
      case 4: return "Контактная информация";
      case 5: return "Финансовая информация";
      case 6: return "Привязка карты";
      default: return "Заявка в КПК";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Выберите сумму и срок займа. Членский взнос 340₽/день";
      case 2: return "Заполните данные для вступления в кооператив";
      case 3: return "Загрузите документы";
      case 4: return "Укажите контакты";
      case 5: return "Финансовые сведения для оценки платежеспособности";
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
          {/* Современный логотип */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-3 md:gap-4 bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl px-6 md:px-10 py-4 md:py-6 shadow-2xl border border-white/40 hover:shadow-3xl transition-all duration-300">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                <Icon name="Banknote" size={24} className="text-white md:w-8 md:h-8" />
              </div>
              <div className="text-left">
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">КПК "Деньги в Дом"</h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">Займы через кредитный потребительский кооператив</p>
              </div>
            </div>
          </div>

          {/* Прогресс-бар в процентах */}
          <ProgressBar currentStep={currentStep} totalSteps={6} />

          <Card className="bg-white/98 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl border border-white/30 min-h-[70vh] md:min-h-0 hover:shadow-3xl transition-all duration-300">
            
            <CardHeader className="text-center pb-6 md:pb-8 px-6 md:px-8 pt-6 md:pt-8 bg-gradient-to-br from-gray-50/50 to-white/50 rounded-t-2xl md:rounded-t-3xl border-b border-gray-100">
              <CardTitle className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon name="CreditCard" size={20} className="text-white md:w-6 md:h-6" />
                </div>
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{getStepTitle()}</span>
              </CardTitle>
              <p className="text-gray-600 text-sm md:text-base font-medium leading-relaxed max-w-md mx-auto">
                {getStepDescription()}
              </p>
            </CardHeader>

            <CardContent className="p-6 md:p-10 space-y-6 md:space-y-8">
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

              {/* Современная навигация */}
              <div className="flex justify-between items-center pt-8 md:pt-10 border-t border-gray-100">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="px-8 py-3 md:py-4 text-sm md:text-base border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl shadow-sm transition-all duration-200 font-medium"
                  >
                    <Icon name="ChevronLeft" size={18} className="mr-2" />
                    Назад
                  </Button>
                )}
                
                <div className="ml-auto">
                  {currentStep === 1 ? null : currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 md:py-4 text-sm md:text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                    >
                      Далее
                      <Icon name="ChevronRight" size={18} className="ml-2" />
                    </Button>
                  ) : currentStep === 5 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 md:py-4 text-sm md:text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                    >
                      К привязке карты
                      <Icon name="ChevronRight" size={18} className="ml-2" />
                    </Button>
                  ) : currentStep === 6 ? null : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 md:py-4 text-sm md:text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Отправляем...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Icon name="Send" size={18} className="mr-2" />
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
      
      {/* Чат поддержки */}
      <SupportChat />
    </div>
  );
};

export default Index;