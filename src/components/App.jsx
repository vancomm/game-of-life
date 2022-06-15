/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import React, {
  useCallback, useRef, useState,
} from 'react';
import produce from 'immer';
import cn from 'classnames';

const CELL_SIZE = '20px';
const NUM_ROWS = 30;
const NUM_COLS = 30;
const MS_TIMEOUT = 250;
const RND_SPARSITY = 0.8;

const vectors = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const getEmptyField = () => Array(NUM_ROWS).fill(Array(NUM_COLS).fill(0));

const getRandomField = () => Array.from(
  Array(NUM_ROWS),
  () => Array.from(
    Array(NUM_COLS),
    () => (Math.random() > RND_SPARSITY ? 1 : 0),
  ),
);

export default function App() {
  const [running, setRunning] = useState(false);

  const [field, setField] = useState(getEmptyField);

  const runningRef = useRef();
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setField((f) => produce(f, (fieldCopy) => {
      for (let i = 0; i < NUM_ROWS; i += 1) {
        for (let j = 0; j < NUM_COLS; j += 1) {
          const neighbours = vectors
            .map(([dx, dy]) => {
              const x = i + dx;
              const y = j + dy;
              if (x >= 0 && x < NUM_ROWS && y >= 0 && y < NUM_COLS) {
                return f[x][y];
              }
              return 0;
            })
            .reduce((sum, add) => sum + add, 0);

          if (neighbours < 2 || neighbours > 3) {
            fieldCopy[i][j] = 0;
          } else if (f[i][j] === 0 && neighbours === 3) {
            fieldCopy[i][j] = 1;
          }
        }
      }
    }));

    setTimeout(runSimulation, MS_TIMEOUT);
  }, []);

  const toggleRunning = () => {
    setRunning(!running);
    if (!running) {
      runningRef.current = true;
      runSimulation();
    }
  };

  const clearField = () => {
    setField(getEmptyField());
  };

  const randomizeField = () => {
    setField(getRandomField());
  };

  const toggleCell = (i, j) => () => {
    setField((f) => produce(f, (fieldCopy) => {
      fieldCopy[i][j] = fieldCopy[i][j] === 0 ? 1 : 0;
    }));
  };

  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     switch (e.key) {
  //       case 's': {
  //         e.preventDefault();
  //         toggleRunning();
  //         break;
  //       }
  //       case 'c': {
  //         e.preventDefault();
  //         clearField();
  //         break;
  //       }
  //       case 'r': {
  //         e.preventDefault();
  //         randomizeField();
  //         break;
  //       }
  //       default: break;
  //     }
  //   };
  //   document.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, []);

  return (
    <>
      <h1>Conway&apos;s Game of Life</h1>
      <div className="buttons">
        <button
          type="button"
          onClick={toggleRunning}
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button
          type="button"
          onClick={clearField}
        >
          Clear
        </button>
        <button
          type="button"
          onClick={randomizeField}
        >
          Random
        </button>
      </div>
      <div
        className={cn('field', running ? 'running' : undefined)}
        style={{ '--num-rows': NUM_ROWS, '--num-cols': NUM_COLS, '--cell-size': CELL_SIZE }}
      >
        {field.map((row, i) => row.map((value, j) => (
          <div
            key={`cell-${i}-${j}`}
            className={cn('cell', (value === 1 ? 'alive' : 'dead'))}
            onClick={toggleCell(i, j)}
          />
        )))}
      </div>
    </>
  );
}
