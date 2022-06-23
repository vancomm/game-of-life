import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function Slider({ value, setValue, tabIndex }) {
  const { theme } = useTheme();

  return (
    <>
      <label
        htmlFor="delay"
        style={{
          fontFamily: 'monospace',
          color: theme.text.color,
          fontSize: '14px',
          display: 'flex',
          width: '100px',
          marginLeft: '5px',
        }}
      >
        Delay:
        {' '}
        {value}
        ms
        <input
          id="delay"
          name="delay"
          type="range"
          min="25"
          max="250"
          step="25"
          value={value}
          list="steplist"
          tabIndex={tabIndex}
          style={{
            color: theme.text.color,
          }}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <datalist id="steplist">
        <option>0</option>
        <option>25</option>
        <option>50</option>
        <option>75</option>
        <option>100</option>
        <option>125</option>
        <option>150</option>
        <option>175</option>
        <option>200</option>
        <option>225</option>
        <option>250</option>
      </datalist>
    </>
  );
}

Slider.propTypes = {
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
  tabIndex: PropTypes.string.isRequired,
};
