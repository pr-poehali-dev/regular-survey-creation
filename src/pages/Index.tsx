import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [formData, setFormData] = useState({
    // Личные данные
    firstName: '',
    lastName: '',
    birthDate: '',
    // Контактные данные
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sendToBitrix24 = async (data: typeof formData) => {
    const webhookUrl = 'https://b24-0vo5vw.bitrix24.ru/rest/1/q5be4cfha7ph0li8/';
    
    try {
      const response = await fetch(`${webhookUrl}crm.lead.add.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            TITLE: `Новая заявка: ${data.firstName} ${data.lastName}`,
            NAME: data.firstName,
            LAST_NAME: data.lastName,
            EMAIL: [{ VALUE: data.email, VALUE_TYPE: 'WORK' }],
            PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
            ADDRESS: data.address,
            COMMENTS: `Дата рождения: ${data.birthDate}\nГород: ${data.city}\nИндекс: ${data.postalCode}`,
            SOURCE_ID: 'WEB',
            SOURCE_DESCRIPTION: 'Заявка с сайта-анкеты'
          }
        })
      });

      const result = await response.json();
      
      if (result.result) {
        return { success: true, leadId: result.result };
      } else {
        throw new Error(result.error_description || 'Ошибка создания лида');
      }
    } catch (error) {
      console.error('Ошибка отправки в Bitrix24:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем обязательные поля
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      await sendToBitrix24(formData);
      setSubmitStatus('success');
      // Очищаем форму после успешной отправки
      setFormData({
        firstName: '',
        lastName: '',
        birthDate: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto max-w-4xl px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-light text-black tracking-tight mb-2">
              Анкета
            </h1>
            <p className="text-gray-600 text-sm">
              Заполните форму для регистрации
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto max-w-2xl px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Личные данные */}
          <Card className="border-0 shadow-none bg-transparent animate-fade-in">
            <CardHeader className="px-0 pb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <Icon name="User" size={14} className="text-white" />
                </div>
                <CardTitle className="text-xl font-light text-black">
                  Личные данные
                </CardTitle>
              </div>
              <Separator className="bg-gray-100" />
            </CardHeader>
            <CardContent className="px-0 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm text-gray-700 font-normal">
                    Имя
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-black focus-visible:ring-0 transition-colors bg-transparent"
                    placeholder="Введите имя"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm text-gray-700 font-normal">
                    Фамилия
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-black focus-visible:ring-0 transition-colors bg-transparent"
                    placeholder="Введите фамилию"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-sm text-gray-700 font-normal">
                  Дата рождения
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-black focus-visible:ring-0 transition-colors bg-transparent"
                />
              </div>
            </CardContent>
          </Card>

          {/* Контактные данные */}
          <Card className="border-0 shadow-none bg-transparent animate-slide-up">
            <CardHeader className="px-0 pb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <Icon name="Mail" size={14} className="text-white" />
                </div>
                <CardTitle className="text-xl font-light text-black">
                  Контактные данные
                </CardTitle>
              </div>
              <Separator className="bg-gray-100" />
            </CardHeader>
            <CardContent className="px-0 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-gray-700 font-normal">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-black focus-visible:ring-0 transition-colors bg-transparent"
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm text-gray-700 font-normal">
                    Телефон
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-black focus-visible:ring-0 transition-colors bg-transparent"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm text-gray-700 font-normal">
                  Адрес
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-black focus-visible:ring-0 transition-colors bg-transparent"
                  placeholder="Улица, дом, квартира"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm text-gray-700 font-normal">
                    Город
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-black focus-visible:ring-0 transition-colors bg-transparent"
                    placeholder="Москва"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-sm text-gray-700 font-normal">
                    Индекс
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 focus:border-black focus-visible:ring-0 transition-colors bg-transparent"
                    placeholder="123456"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle" size={16} className="text-green-600" />
                <p className="text-green-800 text-sm font-medium">
                  Анкета успешно отправлена!
                </p>
              </div>
              <p className="text-green-700 text-xs mt-1">
                Данные переданы в Bitrix24, с вами свяжутся в ближайшее время.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={16} className="text-red-600" />
                <p className="text-red-800 text-sm font-medium">
                  Ошибка отправки
                </p>
              </div>
              <p className="text-red-700 text-xs mt-1">
                Проверьте заполнение обязательных полей (имя, фамилия, email) и попробуйте снова.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-12 py-3 rounded-full transition-colors font-normal min-w-[200px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Отправляем...</span>
                </div>
              ) : (
                'Отправить анкету'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;