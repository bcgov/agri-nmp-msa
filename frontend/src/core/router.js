import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import PageStructure from './app';
import AdminPage from './pages/admin';
import Msa from './pages/msa';

const Router = () => {

  const { i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage).then(() => {
      setLanguage(newLanguage);
    });
  };

  return (
    <BrowserRouter>

      <PageStructure language={language} changeLanguage={changeLanguage}>

        <Switch>
          <Route path="/admin" component={AdminPage} />
          <Route component={Msa} />
        </Switch>

      </PageStructure>

    </BrowserRouter>


  );
};

export default Router;
