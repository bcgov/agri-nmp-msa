import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './navbar';
import RunLogs from './pages/logs';
import PageCustomization from './pages/page_customizer';
import Stations from './pages/stations';

const Router = () => {
  return (
    <BrowserRouter>
      <div id="header">
        <img src="/images/gov3_bc_logo.png" width={155} height={52} alt={'BC Government Logo'} />
        <h1>NMP MSA Administration</h1>
      </div>
      <Navbar />
      <div className={'container'}>
        <Switch>
          <Route path="/admin/logs" component={RunLogs} />
          <Route path="/admin/stations" component={Stations} />
          <Route path="/admin/page" component={PageCustomization} />
          <Route component={RunLogs} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Router;
