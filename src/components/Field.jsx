/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import produce from 'immer';
import PropTypes from 'prop-types';
import Cell from './Cell.jsx';

export default function Field({ rows, cols }) {
  const [field, setField] = useState(() => Array(rows).fill(Array(cols).fill(0)));

  const toggleCell = (i, j) => () => {
    const newField = produce(field, (fieldCopy) => {
      fieldCopy[i][j] = fieldCopy[i][j] === 0 ? 1 : 0;
    });
    setField(newField);
  };

  return (
    <div
      className="field"
      style={{
        '--num-rows': rows,
        '--num-cols': cols,
      }}
    >
      {field.map((row, i) => row.map((value, j) => (
        <Cell
          key={`cell-${i}-${j}`}
          alive={value}
          onClick={toggleCell(i, j)}
        />
      )))}
    </div>
  );
}

Field.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
};
