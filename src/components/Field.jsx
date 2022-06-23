/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function Field({
  field, running, toggleCell, numRows, numCols, cellSize, tabIndex,
}) {
  const { theme } = useTheme();

  const activeCellRef = useRef(null);

  const onKeyDown = (e) => {
    e.stopPropagation();
    const vector = (() => {
      if (!activeCellRef.current) {
        return [0, 0];
      }
      const [x, y] = activeCellRef.current;
      switch (e.key) {
        case 'w': return [x - 1 < 0 ? numRows - 1 : x - 1, y];
        case 'a': return [x, y - 1 < 0 ? numCols - 1 : y - 1];
        case 's': return [x + 1 >= numRows ? 0 : x + 1, y];
        case 'd': return [x, y + 1 >= numCols ? 0 : y + 1];
        case ' ': {
          toggleCell(x, y)();
          return [x, y];
        }
        default: return null;
      }
    })();

    activeCellRef.current = vector;

    if (!vector) return;

    const [a, b] = vector;

    e.preventDefault();
    const cellDiv = document.querySelector(`#cell-${a}-${b}`);
    cellDiv.focus();
  };

  return (
    <div
      id="field"
      tabIndex={tabIndex}
      className={cn('field', running ? 'running' : undefined)}
      style={{
        '--num-rows': numRows,
        '--num-cols': numCols,
        '--cell-size': cellSize,
        width: 'fit-content',
      }}
      onKeyDown={onKeyDown}
    >
      {field.map((row, i) => row.map((value, j) => (
        <div
          key={`cell-${i}-${j}`}
          id={`cell-${i}-${j}`}
          tabIndex="-1"
          className={cn('cell', (value === 1 ? 'alive' : 'dead'))}
          style={{ '--bg-color': theme.cell['bg-color'] }}
          onClick={toggleCell(i, j)}
          onKeyDown={onKeyDown}
          onMouseEnter={(e) => {
            activeCellRef.current = [i, j];
            e.target.focus();
          }}
          onMouseLeave={(e) => {
            activeCellRef.current = null;
            e.target.blur();
          }}
        />
      )))}
    </div>
  );
}

Field.propTypes = {
  field: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  running: PropTypes.bool.isRequired,
  toggleCell: PropTypes.func.isRequired,
  numRows: PropTypes.number.isRequired,
  numCols: PropTypes.number.isRequired,
  cellSize: PropTypes.string.isRequired,
  tabIndex: PropTypes.string.isRequired,
};
