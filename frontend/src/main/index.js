import React from 'react';
import ReactDOM from 'react-dom';
import PageStructure from './page';
import Msa from './pages/msa';
import './main.scss';

ReactDOM.render(
  <PageStructure><Msa /></PageStructure>,
  document.getElementById('root'),
);
