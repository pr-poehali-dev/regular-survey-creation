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
      <Label className="text-sm sm:text-base font-semibold text-gray-700">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base sm:text-sm"
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
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Личные данные</h2>
            <p className="text-sm sm:text-base text-gray-600">Заполните основную информацию о себе</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {renderInput('Имя *', formData.firstName, 'firstName', 'Введите имя', 'text', true)}
            {renderInput('Фамилия *', formData.lastName, 'lastName', 'Введите фамилию', 'text', true)}
          </div>
          {renderInput('Отчество', formData.middleName, 'middleName', 'Введите отчество')}
          {renderInput('Дата рождения *', formData.birthDate, 'birthDate', '', 'date', true)}
        </div>
      )}

      {/* Шаг 2: Документы */}
      {currentStep === 2 && (
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Документы</h2>
            <p className="text-sm sm:text-base text-gray-600">Загрузите необходимые документы</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {renderInput('Серия паспорта *', formData.passportSeries, 'passportSeries', '1234', 'text', true, 4)}
            {renderInput('Номер паспорта *', formData.passportNumber, 'passportNumber', '567890', 'text', true, 6)}
          </div>
          
          {/* Фото паспорта */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold text-gray-700">Фото паспорта *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center hover:border-blue-500 transition-colors bg-gray-50">
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
                <Icon name="FileText" size={28} className="mx-auto text-gray-400 sm:w-8 sm:h-8" />
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    type="button"
                    onClick={() => document.getElementById('passport-camera')?.click()}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto py-2.5 sm:py-2"
                  >
                    <Icon name="Camera" size={16} className="mr-2 sm:mr-1" />
                    Камера
                  </Button>
                  <Button
                    type="button"
                    onClick={() => document.getElementById('passport-gallery')?.click()}
                    size="sm"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto py-2.5 sm:py-2"
                  >
                    <Icon name="Upload" size={16} className="mr-2 sm:mr-1" />
                    Файл
                  </Button>
                </div>
                {formData.passportFile && (
                  <p className="text-green-600 text-sm font-medium break-all">✓ {formData.passportFile.name}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Фото ИНН */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold text-gray-700">Фото ИНН *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center hover:border-blue-500 transition-colors bg-gray-50">
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
                <Icon name="Receipt" size={28} className="mx-auto text-gray-400 sm:w-8 sm:h-8" />
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    type="button"
                    onClick={() => document.getElementById('inn-camera')?.click()}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto py-2.5 sm:py-2"
                  >
                    <Icon name="Camera" size={16} className="mr-2 sm:mr-1" />
                    Камера
                  </Button>
                  <Button
                    type="button"
                    onClick={() => document.getElementById('inn-gallery')?.click()}
                    size="sm"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto py-2.5 sm:py-2"
                  >
                    <Icon name="Upload" size={16} className="mr-2 sm:mr-1" />
                    Файл
                  </Button>
                </div>
                {formData.innFile && (
                  <p className="text-green-600 text-sm font-medium break-all">✓ {formData.innFile.name}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Фото СНИЛС */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold text-gray-700">Фото СНИЛС *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center hover:border-blue-500 transition-colors bg-gray-50">
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
                <Icon name="CreditCard" size={28} className="mx-auto text-gray-400 sm:w-8 sm:h-8" />
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    type="button"
                    onClick={() => document.getElementById('snils-camera')?.click()}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto py-2.5 sm:py-2"
                  >
                    <Icon name="Camera" size={16} className="mr-2 sm:mr-1" />
                    Камера
                  </Button>
                  <Button
                    type="button"
                    onClick={() => document.getElementById('snils-gallery')?.click()}
                    size="sm"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto py-2.5 sm:py-2"
                  >
                    <Icon name="Upload" size={16} className="mr-2 sm:mr-1" />
                    Файл
                  </Button>
                </div>
                {formData.snilsFile && (
                  <p className="text-green-600 text-sm font-medium break-all">✓ {formData.snilsFile.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Шаг 3: Контактные данные */}
      {currentStep === 3 && (
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Контактные данные</h2>
            <p className="text-sm sm:text-base text-gray-600">Укажите способы связи с вами</p>
          </div>
          {renderInput('Email *', formData.email, 'email', 'example@mail.ru', 'email', true)}
          {renderInput('Телефон *', formData.phone, 'phone', '+7 (999) 123-45-67', 'tel', true)}
          {renderInput('Адрес *', formData.address, 'address', 'ул. Пушкина, д. 10, кв. 5', 'text', true)}
          {renderInput('Город *', formData.city, 'city', 'Москва', 'text', true)}
        </div>
      )}

      {/* Шаг 4: Финансовые данные */}
      {currentStep === 4 && (
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Финансовые данные</h2>
            <p className="text-sm sm:text-base text-gray-600">Информация о работе и доходах</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <Icon name="Briefcase" size={18} className="text-blue-600 sm:w-5 sm:h-5" />
              Рабочая информация
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {renderInput('Место работы *', formData.workplace, 'workplace', 'ООО "Компания"', 'text', true)}
              {renderInput('Адрес работы *', formData.workAddress, 'workAddress', 'ул. Рабочая, д. 1, оф. 101', 'text', true)}
              {renderInput('Рабочий телефон *', formData.workPhone, 'workPhone', '+7 (495) 123-45-67', 'tel', true)}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 sm:p-6 border border-green-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <Icon name="Banknote" size={18} className="text-green-600 sm:w-5 sm:h-5" />
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