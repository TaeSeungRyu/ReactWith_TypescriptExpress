import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//레덕스
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import RootReducer from './state/RootReducer'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={configureStore({reducer:RootReducer})}>
      <App />
    </Provider>
  </React.StrictMode>
);


reportWebVitals();
