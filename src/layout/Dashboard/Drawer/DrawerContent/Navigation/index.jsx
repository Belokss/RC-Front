import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const { t } = useTranslation(); // Подключаем функцию перевода `t`

  const navGroups = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} t={t} />; // Передаем `t` в NavGroup для перевода
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            {t(item.title)} {/* Перевод заголовка группы */}
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
