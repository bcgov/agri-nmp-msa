import React from 'react';
import ReactDOM from 'react-dom';
import './main.scss';
import PageStructure from './page';
import { ConfigContext } from './context';

import(/* webpackChunkName: "app_config" */ '../shared/config').then(({ CONFIG }) => {
  ReactDOM.render(
    <ConfigContext.Provider value={CONFIG}>
      <PageStructure />
    </ConfigContext.Provider>,
    document.getElementById('root'),
  );
});
