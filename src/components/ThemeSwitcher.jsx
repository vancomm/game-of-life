import React from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function ThemeSwitcher() {
  const { themes, theme, setTheme } = useTheme();

  return (
    <ButtonGroup>
      {themes.map((t) => (
        <ToggleButton
          key={t.name}
          id={t.name}
          type="radio"
          value={t.name}
          variant={theme.switcher[t.name].variant}
          checked={t.name === theme.name}
          onChange={() => setTheme(t)}
          tabIndex="-1"
        >
          {t.name}
        </ToggleButton>
      ))}
    </ButtonGroup>
  );
}
