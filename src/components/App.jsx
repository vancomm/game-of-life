import React from 'react';
// import { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { actions as fieldActions } from '../slices/fieldSlice';
import Field from './Field.jsx';

/* TODO: rewrite using state from hooks (like Ben Awad) */

const SIZE = 100;

export default function App() {
  return (
    <>
      <h1>Conway&apos;s Game of Life</h1>
      <Field size={SIZE} />
    </>
  );
}
