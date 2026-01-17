import React from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Language } from '@mui/icons-material';
import { useAppContext } from '../contexts/AppContext';

const LanguageToggle = () => {
  const { language, changeLanguage, t } = useAppContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    handleClose();
  };

  return (
    <div>
      <IconButton
        onClick={handleClick}
        size="large"
        edge="end"
        aria-label="language"
        color="inherit"
      >
        <Language />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem selected={language === 'fr'} onClick={() => handleLanguageChange('fr')}>
          <ListItemText primary={t.french} />
        </MenuItem>
        <MenuItem selected={language === 'en'} onClick={() => handleLanguageChange('en')}>
          <ListItemText primary={t.english} />
        </MenuItem>
        <MenuItem selected={language === 'ar'} onClick={() => handleLanguageChange('ar')}>
          <ListItemText primary={t.arabic} />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageToggle;