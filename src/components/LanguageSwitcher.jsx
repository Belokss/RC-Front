// src/components/LanguageSwitcher.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Button } from '@mui/material';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ButtonGroup variant="text" aria-label="language switcher">
      <Button onClick={() => changeLanguage('ru')}>RU</Button>
      <Button onClick={() => changeLanguage('lv')}>LV</Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher;
