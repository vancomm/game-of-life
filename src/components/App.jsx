/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import React, {
  useCallback, useRef, useState,
} from 'react';
import produce from 'immer';
import cn from 'classnames';
import Button from 'react-bootstrap/Button';
import Slider from './Slider.jsx';

const CELL_SIZE = '25px';
const NUM_ROWS = 30;
const NUM_COLS = 30;
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
  const [ms, setMs] = useState(250);

  const runningRef = useRef();
  runningRef.current = running;

  const msRef = useRef();
  msRef.current = ms;

  const [field, setField] = useState(getEmptyField);

  const runSimulation = useCallback((once = false) => {
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
    if (once) return;
    setTimeout(runSimulation, msRef.current);
  }, []);

  const toggleRunning = () => {
    setRunning(!running);
    if (!running) {
      runningRef.current = true;
      runSimulation();
    }
  };

  const runOneGen = () => {
    if (running) return;
    if (!running) {
      runningRef.current = true;
      runSimulation(true);
    }
    setRunning(false);
  };

  const clearField = () => {
    setRunning(false);
    setField(getEmptyField());
  };

  const randomizeField = () => {
    setField(getRandomField());
  };

  const toggleCell = (i, j) => () => {
    if (runningRef.current) return;
    setField((f) => produce(f, (fieldCopy) => {
      fieldCopy[i][j] = fieldCopy[i][j] === 0 ? 1 : 0;
    }));
  };

  return (
    <>
      <h1>Conway&apos;s Game of Life</h1>
      <div className="btn-container">
        <Button
          variant={running ? 'danger' : 'success'}
          onClick={toggleRunning}
        >
          {running ? 'Stop' : 'Start'}
        </Button>
        <Button
          variant="primary"
          onClick={runOneGen}
          disabled={running}
        >
          Next generation
        </Button>
        <Button
          variant="warning"
          onClick={randomizeField}
        >
          Random
        </Button>
        <Button
          variant="danger"
          onClick={clearField}
        >
          Clear
        </Button>
        <Slider value={ms} setValue={setMs} />
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
