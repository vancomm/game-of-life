/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import produce from 'immer';
import Button from 'react-bootstrap/Button';
import Field from './Field.jsx';
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

  const runSimulation = useCallback((runOnce = false) => {
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

    if (runOnce) return;

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

  const prevTheme = useRef(null);

  useEffect(() => {
    document.body.classList.remove(prevTheme.current?.body.classList);
    document.body.classList.add(theme.body.classList);
    prevTheme.current = theme;
  }, [theme]);

  useEffect(() => () => {
    document.body.classList.remove(theme.body.classList);
  }, []);

  return (
    <>
      <h1>
        Conway&apos;s Game of Life
      </h1>
      <div className="btn-container">
        <Button
          tabIndex="1"
          variant={running
            ? theme.buttons.stop.variant
            : theme.buttons.start.variant}
          onClick={toggleRunning}
        >
          {running ? 'Stop' : 'Start'}
        </Button>
        <Button
          tabIndex="2"
          variant={theme.buttons.next.variant}
          onClick={runOneGen}
          disabled={running}
        >
          Next generation
        </Button>
        <Button
          tabIndex="3"
          variant={theme.buttons.random.variant}
          onClick={randomizeField}
        >
          Random
        </Button>
        <Button
          tabIndex="4"
          variant={theme.buttons.clear.variant}
          onClick={clearField}
        >
          Clear
        </Button>

        <Slider value={ms} setValue={setMs} tabIndex="5" />
      </div>
      <Field
        field={field}
        running={running}
        toggleCell={toggleCell}
        numRows={NUM_ROWS}
        numCols={NUM_COLS}
        cellSize={CELL_SIZE}
        tabIndex="6"
      />
      <ThemeSwitcher />
    </>
  );
}

// const handleKeyDown = (i, j) => (e) => {
//   switch (e.key) {
//     case 'ArrowLeft': {
//       e.preventDefault();
//       const y = j - 1 < 0 ? NUM_COLS - 1 : j - 1;
//       const el = document.querySelector(`#cell-${i}-${y}`);
//       el.focus();
//       break;
//     }
//     case 'ArrowRight': {
//       const y = j + 1 >= NUM_COLS ? 0 : j + 1;
//       const el = document.querySelector(`#cell-${i}-${y}`);
//       el.focus();
//       e.preventDefault();
//       break;
//     }
//     case 'ArrowUp': {
//       const x = i - 1 < 0 ? NUM_COLS - 1 : i - 1;
//       const el = document.querySelector(`#cell-${x}-${j}`);
//       el.focus();
//       e.preventDefault();
//       break;
//     }
//     case 'ArrowDown': {
//       const x = i + 1 >= NUM_COLS ? 0 : i + 1;
//       const el = document.querySelector(`#cell-${x}-${j}`);
//       el.focus();
//       e.preventDefault();
//       break;
//     }
//     default:
//       break;
//   }
// };

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
