import React from 'react';

import './app.scss';

import NavComponent from './nav';

const PageStructure = (props) => {

  const { children } = props;

  return (
    [
      <NavComponent key="mainNav" />,
      <>
        {children}
      </>]
  );
};

export default PageStructure;
