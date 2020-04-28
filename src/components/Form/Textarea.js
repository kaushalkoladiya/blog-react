import React from 'react';
// import resize from 'res/'
import './Input.css';

const textarea = props => {
  return (
    <div className="input">
      <label htmlFor={props.id}>{props.label}</label>
      <textarea
        className={[
          props.valid ? 'valid' : 'invalid',
          props.touch ? 'touched' : 'untouched'
        ].join(' ')}
        id={props.id}
        rows={props.rows}
        required={props.required}
        value={props.value}
        placeholder={props.placeholder}
        onChange={e => props.onChange(props.id, e.target.value)}
        onBlur={props.onBlur}
      />
    </div>
  );
}

export default textarea;


