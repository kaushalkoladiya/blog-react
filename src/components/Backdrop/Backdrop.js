import React from 'react';
import ReactDom from 'react-dom';

import './Backdrop';

const backdrop = props =>
  ReactDom.createPortal(
    <div
      className={['backdrop', props.open ? 'open' : ''].join(' ')}
      onClick={props.onClick}
    />,
    document.getElementById('backdrop-root')
  );

export default backdrop;