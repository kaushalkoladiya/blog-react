import React from 'react';

import './Input.css';

const Login = props => {
  return (
    <div className="input">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        className={[
          props.valid ? 'valid' : 'invalid',
          props.touched ? 'touched' : 'untouched'
        ].join(' ')}
        onBlur={props.onBlur}
        onChange={e => props.onChange(props.id, e.target.value, e.target.files)}
        value={props.value}
        id={props.id}
        type={props.type}
        requried={props.requried}
        placeholder={props.placeholder}
      />
    </div>
  );
}

export default Login;