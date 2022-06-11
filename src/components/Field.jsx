import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { actions as fieldActions } from '../slices/fieldSlice';
import Cell from './Cell.jsx';

export default function Field({ size }) {
  const dispatch = useDispatch();

  const field = useSelector((state) => state.field.value);

  useEffect(() => {
    dispatch(fieldActions.setField(size));
  }, []);

  return (
    <table>
      <thead />
      <tbody>
        {Object.entries(field).map(([i, row]) => (
          <tr key={`tw-${i}`}>
            {Object.entries(row).map(([j, value]) => (
              <Cell key={`cell-${i}-${j}`} i={i} j={j} status={value} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Field.propTypes = {
  size: PropTypes.number.isRequired,
};
