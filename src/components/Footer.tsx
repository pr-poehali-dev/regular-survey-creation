import React from 'react';
import Icon from '@/components/ui/icon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Декоративный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Логотип и описание */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="Banknote" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">КПК "Деньги в Дом"</h3>
                <p className="text-gray-400 text-sm">Кредитный потребительский кооператив</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Надежные займы для членов кооператива с прозрачными условиями и персональным подходом.
            </p>
          </div>

          {/* Контактная информация */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Icon name="Phone" size={20} className="text-blue-400" />
              Контакты
            </h4>
            <div className="space-y-3">
              <a 
                href="tel:+78002727282" 
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <Icon name="Phone" size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">+7 (800) 2727-28-28</p>
                  <p className="text-xs text-gray-400">Бесплатный звонок по России</p>
                </div>
              </a>
              
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Круглосуточно</p>
                  <p className="text-xs text-gray-400">7 дней в неделю</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Icon name="MessageCircle" size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Онлайн поддержка</p>
                  <p className="text-xs text-gray-400">Чат на сайте</p>
                </div>
              </div>
            </div>
          </div>

          {/* Правовая информация */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Icon name="Shield" size={20} className="text-green-400" />
              Лицензия
            </h4>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Award" size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Зарегистрировано в ЦБ РФ</p>
                  <p className="text-gray-400 text-sm">Центральный Банк Российской Федерации</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-lg p-3 border border-blue-500/20">
                <p className="text-xs text-gray-300 mb-1">Регистрационный номер:</p>
                <p className="text-lg font-mono font-bold text-white">292800028279928</p>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 leading-relaxed">
              <p className="mb-2">
                ⚠️ КПК осуществляет деятельность исключительно с членами кооператива.
              </p>
              <p>
                Членский взнос: 340₽/день
              </p>
            </div>
          </div>
        </div>

        {/* Разделительная линия */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              <p>© 2024 КПК "Деньги в Дом". Все права защищены.</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Icon name="Lock" size={16} className="text-green-400" />
                <span>SSL защищено</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Icon name="Verified" size={16} className="text-blue-400" />
                <span>Лицензия ЦБ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;