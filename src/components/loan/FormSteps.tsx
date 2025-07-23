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

  const renderGlassInput = (
    label: string,
    value: string | number,
    field: keyof FormData,
    placeholder: string,
    type: string = 'text',
    required: boolean = false,
    maxLength?: number
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-white/90 mb-2 block">{label}</Label>
      <div className="relative">
        <Input
          type={type}
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:bg-white/20 transition-all duration-300 transform focus:scale-105 focus:shadow-2xl focus:shadow-blue-500/25 h-12"
          style={{
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );

  return (
    <>
      {/* Шаг 1: Личные данные */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderGlassInput('Имя *', formData.firstName, 'firstName', 'Введите имя', 'text', true)}
            {renderGlassInput('Фамилия *', formData.lastName, 'lastName', 'Введите фамилию', 'text', true)}
          </div>
          {renderGlassInput('Отчество', formData.middleName, 'middleName', 'Введите отчество')}
          {renderGlassInput('Дата рождения *', formData.birthDate, 'birthDate', '', 'date', true)}
        </div>
      )}

      {/* Шаг 2: Документы */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 gap-6">
            {renderGlassInput('Серия паспорта *', formData.passportSeries, 'passportSeries', '1234', 'text', true, 4)}
            {renderGlassInput('Номер паспорта *', formData.passportNumber, 'passportNumber', '567890', 'text', true, 6)}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white/90">Фото паспорта *</Label>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-blue-400/50 transition-colors bg-white/5 backdrop-blur-sm">
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
                <Icon name="Camera" size={48} className="mx-auto text-white/70" />
                <div className="flex gap-3 justify-center">
                  <Button
                    type="button"
                    onClick={() => document.getElementById('passport-camera')?.click()}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-400/30 backdrop-blur-sm"
                  >
                    <Icon name="Camera" size={16} className="mr-2" />
                    Сфотографировать
                  </Button>
                  <Button
                    type="button"
                    onClick={() => document.getElementById('passport-gallery')?.click()}
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-white border border-purple-400/30 backdrop-blur-sm"
                  >
                    <Icon name="Upload" size={16} className="mr-2" />
                    Выбрать файл
                  </Button>
                </div>
                {formData.passportFile && (
                  <p className="text-green-400 text-sm">✓ {formData.passportFile.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Шаг 3: Контактные данные */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fade-in">
          {renderGlassInput('Email *', formData.email, 'email', 'example@mail.ru', 'email', true)}
          {renderGlassInput('Телефон *', formData.phone, 'phone', '+7 (999) 123-45-67', 'tel', true)}
          
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white/90">Код подтверждения *</Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  value={formData.phoneCode}
                  onChange={(e) => handleInputChange('phoneCode', e.target.value)}
                  className="rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:bg-white/20 transition-all duration-300 transform focus:scale-105 focus:shadow-2xl focus:shadow-blue-500/25 h-12"
                  style={{
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  placeholder="1234"
                  maxLength={4}
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
              </div>
              <Button
                type="button"
                onClick={sendVerificationCode}
                className="bg-green-500/20 hover:bg-green-500/30 text-white border border-green-400/30 backdrop-blur-sm px-6"
              >
                Отправить код
              </Button>
            </div>
          </div>
          
          {renderGlassInput('Адрес *', formData.address, 'address', 'ул. Пушкина, д. 10, кв. 5', 'text', true)}
          {renderGlassInput('Город *', formData.city, 'city', 'Москва', 'text', true)}
        </div>
      )}

      {/* Шаг 4: Финансовые данные */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fade-in">
          {/* Калькулятор займа */}
          <div className="bg-gradient-to-br from-blue-50/10 to-purple-50/10 rounded-2xl p-6 border border-blue-200/20 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="Calculator" size={20} />
              Калькулятор займа
            </h3>
            
            {/* Сумма займа */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold text-white/90">Сумма займа</Label>
                <span className="text-lg font-bold text-blue-400">{animatedLoanAmount.toLocaleString()} ₽</span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={formData.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>5 000 ₽</span>
                <span>500 000 ₽</span>
              </div>
            </div>
            
            {/* Срок займа */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold text-white/90">Срок займа</Label>
                <span className="text-lg font-bold text-purple-400">{formData.loanTerm} дней</span>
              </div>
              <input
                type="range"
                min="7"
                max="365"
                step="1"
                value={formData.loanTerm}
                onChange={(e) => handleInputChange('loanTerm', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>7 дней</span>
                <span>365 дней</span>
              </div>
            </div>
            
            {/* Расчет */}
            <div className="bg-white/5 rounded-xl p-4 space-y-2 backdrop-blur-sm">
              <div className="flex justify-between">
                <span className="text-white/70">К возврату:</span>
                <span className="font-bold text-green-400">{animatedTotalAmount.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Переплата:</span>
                <span className="font-bold text-orange-400">{animatedOverpayment.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Платеж в день:</span>
                <span className="font-bold text-blue-400">{animatedDailyPayment.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>
          
          {renderGlassInput('Место работы *', formData.workplace, 'workplace', 'Название организации', 'text', true)}
          {renderGlassInput('Ежемесячный доход *', formData.income, 'income', '50000', 'number', true)}
        </div>
      )}
    </>
  );
};

export default FormSteps;