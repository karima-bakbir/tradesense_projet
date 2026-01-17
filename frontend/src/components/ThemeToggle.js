import React from 'react';
import { IconButton } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useAppContext } from '../contexts/AppContext';

const ThemeToggle = () => {
  const { mode, toggleTheme, t } = useAppContext();

  return (
    <IconButton
      onClick={toggleTheme}
      size="large"
      edge="end"
      aria-label={mode === 'dark' ? 'light mode' : 'dark mode'}
      color="inherit"
    >
      {mode === 'dark' ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};

export default ThemeToggle;