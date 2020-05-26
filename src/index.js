import 'react-app-polyfill/ie11';

import React from 'react';
import { StoreProvider } from './stores/AppStore';
import { HelmetProvider } from 'react-helmet-async';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import ReactDOM from 'react-dom';
import './sass/index.scss';
import App from './containers/App/App';
import * as serviceWorker from './serviceWorker';
import "wired-elements";

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <AlertProvider template={AlertTemplate} {...options}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </AlertProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();