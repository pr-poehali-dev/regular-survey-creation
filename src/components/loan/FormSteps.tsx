import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useCountAnimation } from '@/hooks/useCountAnimation';

export interface FormData {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  passportSeries: string;
  passportNumber: string;
  passportFile?: File;
  email: string;
  phone: string;
  phoneCode: string;
  address: string;
  city: string;
  income: string;
  workplace: string;
  loanAmount: number;
  loanTerm: number;
}

interface FormStepsProps {
  currentStep: number;
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string | number | File) => void;
  calculateLoan: () => {
    totalAmount: number;
    overpayment: number;
    dailyPayment: number;
  };
  sendVerificationCode: () => void;
}

const FormSteps: React.FC<FormStepsProps> = ({
  currentStep,
  formData,
  handleInputChange,
  calculateLoan,
  sendVerificationCode
}) => {
  const loanCalculation = calculateLoan();
  const animatedLoanAmount = useCountAnimation(formData.loanAmount);
  const animatedTotalAmount = useCountAnimation(loanCalculation.totalAmount);
  const animatedOverpayment = useCountAnimation(loanCalculation.overpayment);
  const animatedDailyPayment = useCountAnimation(Math.round(loanCalculation.dailyPayment));

  const renderInput = (
    label: string,
    value: string | number,
    field: keyof FormData,
    placeholder: string,
    type: string = 'text',
    required: boolean = false,
    maxLength?: number
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-gray-700">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
      />
    </div>
  );

  return (
    <>
      {/* Шаг 1: Личные данные */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('Имя *', formData.firstName, 'firstName', 'Введите имя', 'text', true)}
            {renderInput('Фамилия *', formData.lastName, 'lastName', 'Введите фамилию', 'text', true)}
          </div>
          {renderInput('Отчество', formData.middleName, 'middleName', 'Введите отчество')}
          {renderInput('Дата рождения *', formData.birthDate, 'birthDate', '', 'date', true)}
        </div>
      )}

      {/* Шаг 2: Документы */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 gap-6">
            {renderInput('Серия паспорта *', formData.passportSeries, 'passportSeries', '1234', 'text', true, 4)}
            {renderInput('Номер паспорта *', formData.passportNumber, 'passportNumber', '567890', 'text', true, 6)}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Фото паспорта *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors bg-gray-50">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                id="passport-camera"
                onChange={(e) => e.target.files?.[0] && handleInputChange('passportFile', e.target.files[0])}
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="passport-gallery"
                onChange={(e) => e.target.files?.[0] && handleInputChange('passportFile', e.target.files[0])}
              />
              <div className="space-y-4">
                <Icon name="Camera" size={48} className="mx-auto text-gray-400" />
                <div className="flex gap-3 justify-center">
                  <Button
                    type="button"
                    onClick={() => document.getElementById('passport-camera')?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Icon name="Camera" size={16} className="mr-2" />
                    Сфотографировать
                  </Button>
                  <Button
                    type="button"
                    onClick={() => document.getElementById('passport-gallery')?.click()}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Icon name="Upload" size={16} className="mr-2" />
                    Выбрать файл
                  </Button>
                </div>
                {formData.passportFile && (
                  <p className="text-green-600 text-sm">✓ {formData.passportFile.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Шаг 3: Контактные данные */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fade-in">
          {renderInput('Email *', formData.email, 'email', 'example@mail.ru', 'email', true)}
          {renderInput('Телефон *', formData.phone, 'phone', '+7 (999) 123-45-67', 'tel', true)}
          
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Код подтверждения *</Label>
            <div className="flex gap-3">
              <Input
                value={formData.phoneCode}
                onChange={(e) => handleInputChange('phoneCode', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1234"
                maxLength={4}
                required
              />
              <Button
                type="button"
                onClick={sendVerificationCode}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                Отправить код
              </Button>
            </div>
          </div>
          
          {renderInput('Адрес *', formData.address, 'address', 'ул. Пушкина, д. 10, кв. 5', 'text', true)}
          {renderInput('Город *', formData.city, 'city', 'Москва', 'text', true)}
        </div>
      )}

      {/* Шаг 4: Финансовые данные */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fade-in">
          {/* Калькулятор займа */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icon name="Calculator" size={20} className="text-blue-600" />
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
            <div className="bg-white rounded-xl p-4 space-y-2 border border-gray-200">
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
          
          {renderInput('Место работы *', formData.workplace, 'workplace', 'Название организации', 'text', true)}
          {renderInput('Ежемесячный доход *', formData.income, 'income', '50000', 'number', true)}
        </div>
      )}
    </>
  );
};

export default FormSteps;