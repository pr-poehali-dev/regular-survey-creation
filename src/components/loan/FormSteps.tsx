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
  innFile?: File;
  snilsFile?: File;
  email: string;
  phone: string;
  address: string;
  city: string;
  income: string;
  workplace: string;
  workAddress: string;
  workPhone: string;
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
          
          {/* Фото паспорта */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Фото паспорта *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors bg-gray-50">
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
              <div className="space-y-3">
                <Icon name="FileText" size={32} className="mx-auto text-gray-400" />
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    onClick={() => document.getElementById('passport-camera')?.click()}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Icon name="Camera" size={14} className="mr-1" />
                    Камера
                  </Button>
                  <Button
                    type="button"
                    onClick={() => document.getElementById('passport-gallery')?.click()}
                    size="sm"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Icon name="Upload" size={14} className="mr-1" />
                    Файл
                  </Button>
                </div>
                {formData.passportFile && (
                  <p className="text-green-600 text-sm font-medium">✓ {formData.passportFile.name}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Фото ИНН */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Фото ИНН *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors bg-gray-50">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                id="inn-camera"
                onChange={(e) => e.target.files?.[0] && handleInputChange('innFile', e.target.files[0])}
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="inn-gallery"
                onChange={(e) => e.target.files?.[0] && handleInputChange('innFile', e.target.files[0])}
              />
              <div className="space-y-3">
                <Icon name="Receipt" size={32} className="mx-auto text-gray-400" />
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    onClick={() => document.getElementById('inn-camera')?.click()}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Icon name="Camera" size={14} className="mr-1" />
                    Камера
                  </Button>
                  <Button
                    type="button"
                    onClick={() => document.getElementById('inn-gallery')?.click()}
                    size="sm"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Icon name="Upload" size={14} className="mr-1" />
                    Файл
                  </Button>
                </div>
                {formData.innFile && (
                  <p className="text-green-600 text-sm font-medium">✓ {formData.innFile.name}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Фото СНИЛС */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Фото СНИЛС *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors bg-gray-50">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                id="snils-camera"
                onChange={(e) => e.target.files?.[0] && handleInputChange('snilsFile', e.target.files[0])}
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="snils-gallery"
                onChange={(e) => e.target.files?.[0] && handleInputChange('snilsFile', e.target.files[0])}
              />
              <div className="space-y-3">
                <Icon name="CreditCard" size={32} className="mx-auto text-gray-400" />
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    onClick={() => document.getElementById('snils-camera')?.click()}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Icon name="Camera" size={14} className="mr-1" />
                    Камера
                  </Button>
                  <Button
                    type="button"
                    onClick={() => document.getElementById('snils-gallery')?.click()}
                    size="sm"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Icon name="Upload" size={14} className="mr-1" />
                    Файл
                  </Button>
                </div>
                {formData.snilsFile && (
                  <p className="text-green-600 text-sm font-medium">✓ {formData.snilsFile.name}</p>
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
          {renderInput('Адрес *', formData.address, 'address', 'ул. Пушкина, д. 10, кв. 5', 'text', true)}
          {renderInput('Город *', formData.city, 'city', 'Москва', 'text', true)}
        </div>
      )}

      {/* Шаг 4: Финансовые данные */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icon name="Briefcase" size={20} className="text-blue-600" />
              Рабочая информация
            </h3>
            <div className="space-y-4">
              {renderInput('Место работы *', formData.workplace, 'workplace', 'ООО "Компания"', 'text', true)}
              {renderInput('Адрес работы *', formData.workAddress, 'workAddress', 'ул. Рабочая, д. 1, оф. 101', 'text', true)}
              {renderInput('Рабочий телефон *', formData.workPhone, 'workPhone', '+7 (495) 123-45-67', 'tel', true)}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icon name="Banknote" size={20} className="text-green-600" />
              Доходы
            </h3>
            {renderInput('Ежемесячный доход *', formData.income, 'income', '50000', 'number', true)}
          </div>
        </div>
      )}
    </>
  );
};

export default FormSteps;