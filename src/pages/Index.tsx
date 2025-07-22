import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { useState } from "react";

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button 
              type="submit"
              className="bg-black hover:bg-gray-800 text-white px-12 py-3 rounded-full transition-colors font-normal"
            >
              Отправить анкету
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;