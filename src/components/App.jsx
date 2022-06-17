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
import ThemeSwitcher from './ThemeSwitcher.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const CELL_SIZE = '30px';
const NUM_ROWS = 25;
const NUM_COLS = 25;
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

  const [ms, setMs] = useState(100);

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
            .map(([di, dj]) => {
              const x = (() => {
                if (i + di < 0) return NUM_ROWS - 1;
                if (i + di === NUM_ROWS) return 0;
                return i + di;
              })();
              const y = (() => {
                if (j + dj < 0) return NUM_COLS - 1;
                if (j + dj === NUM_COLS) return 0;
                return j + dj;
              })();
              return f[x][y];
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

  const { theme } = useTheme();

  document.body.classList = theme.body.classList;

  return (
    <>
      <h1>
        Conway&apos;s Game of Life
      </h1>
      <div className="btn-container">
        <Button
          variant={running ? theme.buttons.stop.variant : theme.buttons.start.variant}
          onClick={toggleRunning}
        >
          {running ? 'Stop' : 'Start'}
        </Button>
        <Button
          variant={theme.buttons.next.variant}
          onClick={runOneGen}
          disabled={running}
        >
          Next generation
        </Button>
        <Button
          variant={theme.buttons.random.variant}
          onClick={randomizeField}
        >
          Random
        </Button>
        <Button
          variant={theme.buttons.clear.variant}
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
            style={{ '--bg-color': theme.cell['bg-color'] }}
            onClick={toggleCell(i, j)}
          />
        )))}
      </div>
      <ThemeSwitcher />
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
