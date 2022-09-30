import React from 'react';
import ReactDOM from 'react-dom';

import './admin.scss';
import Router from './router';
import { ConfigContext } from './context';

import(/* webpackChunkName: "app_config" */ '../shared/config').then(({ CONFIG }) => {
  ReactDOM.render(
    <ConfigContext.Provider value={CONFIG}>
      <Router CONFIG={CONFIG} />
    </ConfigContext.Provider>,
    document.getElementById('root'),
  );
});
