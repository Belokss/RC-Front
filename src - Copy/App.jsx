import { RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Импортируем useTranslation

// project import
import router from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';

export default function App() {
  const { i18n } = useTranslation(); // Получаем доступ к функции i18n
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang); // Меняем язык на выбранный
  };

  return (
    <ThemeCustomization>
      <ScrollTop>
        {/* Кнопки для смены языка */}
        <button onClick={() => handleLanguageChange('ru')}>RU</button>
        <button onClick={() => handleLanguageChange('lv')}>LV</button>
        
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
