/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import React, { useCallback, useRef, useState } from 'react';
import produce from 'immer';
import Cell from './Cell.jsx';

/* TODO: rewrite using state from hooks (like Ben Awad) */

const NUM_ROWS = 30;
const NUM_COLS = 30;
const MS_TIMEOUT = 250;

const neighbourVectors = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export default function App() {
  const [running, setRunning] = useState(false);

  const [field, setField] = useState(
    () => Array(NUM_ROWS).fill(Array(NUM_COLS).fill(0)),
  );

  const runningRef = useRef();
  runningRef.current = running;

  const runNextGen = useCallback(() => {
    if (!runningRef.current) return;

    setField((f) => produce(f, (c) => {
      for (let i = 0; i < NUM_ROWS; i += 1) {
        for (let j = 0; j < NUM_COLS; j += 1) {
          const neighbours = neighbourVectors.map(([dx, dy]) => {
            const x = i + dx;
            const y = j + dy;
          });
        }
      }
    }));

    setTimeout(runNextGen, MS_TIMEOUT);
  }, []);

  const toggleRunning = () => {
    setRunning(!running);
  };

  const toggleCell = (i, j) => () => {
    const newField = produce(field, (fieldCopy) => {
      fieldCopy[i][j] = fieldCopy[i][j] === 0 ? 1 : 0;
    });
    setField(newField);
  };

  return (
    <>
      <h1>Conway&apos;s Game of Life</h1>
      <div id="buttons">
        <button
          type="button"
          onClick={toggleRunning}
        >
          {running ? 'Stop' : 'Start'}
        </button>
      </div>
      <div
        className="field"
        style={{
          '--num-rows': NUM_ROWS,
          '--num-cols': NUM_COLS,
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
    </>
  );
}
