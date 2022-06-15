import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';
import './styles/style.css';

const mountNode = document.getElementById('root');
const root = ReactDOM.createRoot(mountNode);

root.render(<App />);
