import React, {
  useContext, useMemo, useState, createContext,
} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const ThemeContext = createContext();

const themes = [
  {
    name: 'light',
    body: {
      classList: cn('bg-white'),
    },
    text: {
      color: 'black',
    },
    cell: {
      'bg-color': 'black',
    },
    buttons: {
      start: {
        variant: 'success',
      },
      stop: {
        variant: 'danger',
      },
      next: {
        variant: 'primary',
      },
      random: {
        variant: 'warning',
      },
      clear: {
        variant: 'danger',
      },
    },
    switcher: {
      light: {
        variant: 'primary',
      },
      dark: {
        variant: 'secondary',
      },
    },
  },
  {
    name: 'dark',
    body: {
      classList: cn('bg-black'),
    },
    text: {
      color: 'white',
    },
    cell: {
      'bg-color': 'white',
    },
    buttons: {
      start: {
        variant: 'outline-success',
      },
      stop: {
        variant: 'outline-danger',
      },
      next: {
        variant: 'outline-primary',
      },
      random: {
        variant: 'outline-warning',
      },
      clear: {
        variant: 'outline-danger',
      },
    },
    switcher: {
      light: {
        variant: 'outline-secondary',
      },
      dark: {
        variant: 'outline-primary',
      },
    },
  },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(themes[0]);

  const value = useMemo(() => ({ themes, theme, setTheme }), [theme]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useTheme() {
  return useContext(ThemeContext);
}
