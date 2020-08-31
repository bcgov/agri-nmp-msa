import React from 'react';
import { Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import './app.scss';

import NavComponent from './nav';


const PageStructure = (props) => {
  // const { i18n } = useTranslation();

  const history = useHistory();
  const { children, language, changeLanguage } = props;

  return (
    [
      <a key={'tl'}
         onClick={() => {
           history.push('/');
         }}
      >
        <Trans key="common.title"></Trans>
        AGRI NMP MSA Tool
      </a>,
      <NavComponent key="mainNav" />,
      // <div key="main">
      <>
        {children}
      </>,
      // </div>,
    ]
  );
};

export default PageStructure;
