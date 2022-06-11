/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import { actions as fieldActions } from '../slices/fieldSlice.js';

export default function Cell({ i, j, status }) {
  const dispatch = useDispatch();

  const handleClick = (ii, jj) => () => {
    dispatch(fieldActions.toggleCell({ i: ii, j: jj }));
  };

  return (
    <td
      id={`td-${i}-${j}`}
      className={cn('cell', status)}
      onClick={handleClick(i, j)}
    />
  );
}

Cell.propTypes = {
  i: PropTypes.string.isRequired,
  j: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['dead', 'alive']).isRequired,
};
