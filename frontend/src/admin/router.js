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
      <h2>Administration</h2>
      <Navbar />
      <hr />
      <Switch>
        <Route path="/admin/logs" component={RunLogs} />
        <Route path="/admin/stations" component={Stations} />
        <Route path="/admin/page" component={PageCustomization} />
        <Route component={RunLogs} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
