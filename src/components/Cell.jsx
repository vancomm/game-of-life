/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

export default function Cell({ alive, onClick }) {
  return (
    <div
      className={cn('cell', (alive ? 'alive' : 'dead'))}
      onClick={onClick}
    />
  );
}

Cell.propTypes = {
  alive: PropTypes.oneOf([0, 1]).isRequired,
  onClick: PropTypes.func.isRequired,
};
