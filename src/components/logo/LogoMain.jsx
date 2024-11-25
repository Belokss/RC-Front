// material-ui
import { useTheme } from '@mui/material/styles';

// Импортируем изображение логотипа
import logo from 'assets/logo.png';

// ==============================|| LOGO COMPONENT ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    // Используем <img> для логотипа вместо SVG
    <img src={logo} alt="Логотип" width="170" />
  );
};

export default Logo;
