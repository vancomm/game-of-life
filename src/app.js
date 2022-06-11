/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-continue */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import './style.css';
import { range } from './range.js';

const SIZE = 100;

function render(state, container) {
  // console.log(state);

  const label = document.querySelector('label[for="delay"]');
  label.textContent = `Delay: ${state.ms}ms`;

  const startBtn = document.querySelector('#run');
  const nextBtn = document.querySelector('#next');

  if (state.running) {
    startBtn.innerHTML = '<u>S</u>top';
    nextBtn.setAttribute('disabled', '');
    container.classList.remove('drawing');
    container.classList.add('running');
  } else {
    startBtn.innerHTML = '<u>S</u>tart';
    nextBtn.removeAttribute('disabled');
    container.classList.remove('running');
    container.classList.add('drawing');
  }

  const rows = container.querySelectorAll('.row');
  rows.forEach((row, i) => {
    const cells = row.querySelectorAll('.cell');
    cells.forEach((cell, j) => {
      // cell.textContent = countNeighbours(i, j, state.field);
      if (state.field[i][j]) {
        cell.classList.add('alive');
      } else {
        cell.classList.remove('alive');
      }
    });
  });

  const statsDiv = document.querySelector('.stats');
  statsDiv.textContent = `time: ${state.time} population: ${state.population}`;
}

function countNeighbours(i, j, field) {
  let count = 0;
  range(i - 1, i + 2).forEach((r) => {
    range(j - 1, j + 2).forEach((c) => {
      if (r >= 0 && c >= 0 && r < field.length && c < field.length) {
        if ((r === i) && (c === j)) return;
        if (field[r][c]) count += 1;
      }
    });
  });
  return count;
}

function countPopulation(field) {
  return field.flat().filter((x) => x === true).length;
}

function nextGen(field) {
  const newField = field.map((row, i) => row.map((cell, j) => {
    const nCount = countNeighbours(i, j, field);
    if (cell && (nCount === 2 || nCount === 3)) return true;
    if (!cell && nCount === 3) return true;
    return false;
  }));
  return newField;
}

function stopRunning(state) {
  state.running = false;
  clearInterval(state.intervalId);
}

function startRunning(state, table) {
  state.running = true;
  state.intervalId = setInterval(() => {
    state.field = nextGen(state.field);
    state.population = countPopulation(state.field);
    state.time += 1;
    render(state, table);
  }, state.ms, 5);
}

function makeClearField(n) {
  return range(n).map(() => range(n).map(() => false));
}

function init() {
  const state = {
    isMouseDown: false,
    running: false,
    ms: 50,
    field: makeClearField(SIZE),
    time: 0,
    population: 0,
  };

  const table = document.querySelector('#field');
  table.classList.add('drawing');

  range(SIZE).forEach((_, i) => {
    const row = table.insertRow();
    row.classList.add('row');
    range(SIZE).forEach((_, j) => {
      const cell = row.insertCell();
      cell.classList.add('cell');

      cell.onmousedown = (e) => {
        e.preventDefault();
        state.isMouseDown = true;
        if (state.running) return;
        state.field[i][j] = !state.field[i][j];
        render(state, table);
      };

      cell.onmouseover = (e) => {
        e.preventDefault();
        if (!state.isMouseDown) return;
        if (state.running) return;
        state.field[i][j] = !state.field[i][j];
        render(state, table);
      };
    });
  });

  const startBtn = document.querySelector('#run');
  startBtn.onclick = () => {
    if (state.running) {
      stopRunning(state);
      render(state, table);
    } else {
      startRunning(state, table);
      render(state, table);
    }
  };

  const nextBtn = document.querySelector('#next');
  nextBtn.onclick = () => {
    state.field = nextGen(state.field);
    state.time += 1;
    state.population = countPopulation(state.field);
    render(state, table);
  };

  const clearBtn = document.querySelector('#clear');
  clearBtn.onclick = () => {
    stopRunning(state);
    state.field = makeClearField(SIZE);
    state.time = 0;
    state.population = 0;
    render(state, table);
  };

  const delaySlider = document.querySelector('#delay');

  delaySlider.addEventListener('input', () => {
    state.ms = Math.max(parseInt(delaySlider.value, 10), 5);
    stopRunning(state);
    startRunning(state, table);
  });

  document.onmouseup = () => {
    state.isMouseDown = false;
  };

  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'c') {
      clearBtn.click();
      return;
    }
    if (e.key === 's') {
      startBtn.click();
    }
    if (e.key === 'n') {
      nextBtn.click();
    }
  });

  return state;
}

export default function app() {
  const state = init();
  const table = document.querySelector('#field');
  render(state, table);
}
