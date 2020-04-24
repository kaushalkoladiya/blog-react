import React from 'react';
// import { Link } from 'react-router-dom';

import './Button.css';

const button = props =>
  (
    <button className={[
      'button',
      `button--${props.design}`,
      `button--${props.mode}`,
    ].join(' ')}
    onClick={props.onClick}
    type={props.type}
    disabled={props.disabled || props.loading}
    >
      {props.loading ? 'Loading...' : props.children}
    </button>
  );

export default button;
