import React, { createContext, useContext, useState } from 'react';

// Создаем контекст для хранения языка
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('lv'); // Устанавливаем начальный язык латышский

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'lv' ? 'ru' : 'lv'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
