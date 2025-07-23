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
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-2xl mx-auto px-4">
        <form onSubmit={handleSubmit}>
          {/* Логотип вверху */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-8 py-4 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Icon name="Banknote" size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-800">Деньги в Дом</h1>
                <p className="text-sm text-gray-500">Быстрые займы онлайн</p>
              </div>
            </div>
          </div>

          {/* Прогресс-бар с пульсацией */}
          <StepProgressBar currentStep={currentStep} totalSteps={4} />

          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200">
            
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                <Icon name="CreditCard" size={28} className="text-blue-600" />
                {getStepTitle()}
              </CardTitle>
              <p className="text-gray-600 text-sm">
                {getStepDescription()}
              </p>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <FormSteps 
                currentStep={currentStep}
                formData={formData}
                handleInputChange={handleInputChange}
                calculateLoan={calculateLoan}
                sendVerificationCode={sendVerificationCode}
              />

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
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                    >
                      Далее
                      <Icon name="ChevronRight" size={16} className="ml-2" />
                    </Button>
                  ) : (
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