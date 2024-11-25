// HeaderContent/LanguageSwitcher.jsx

import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

// Импорт флажков (замените пути на правильные для ваших изображений флагов)
import FlagRU from 'path/to/flag-ru.svg';
import FlagLV from 'path/to/flag-lv.svg';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  // Открытие и закрытие меню
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Функция для смены языка
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  return (
    <Box>
      <IconButton onClick={handleOpen} color="inherit">
        <LanguageIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => changeLanguage('ru')}>
          <Box component="img" src={FlagRU} alt="RU" sx={{ width: 24, height: 16, mr: 1 }} />
          <Typography>Русский</Typography>
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('lv')}>
          <Box component="img" src={FlagLV} alt="LV" sx={{ width: 24, height: 16, mr: 1 }} />
          <Typography>Latviešu</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
