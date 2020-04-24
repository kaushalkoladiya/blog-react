import React, { Component } from 'react';

import Input from '../../components/Form/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';

class Login extends Component {
  state = {
    loginForm: {
      email: {
        value: '',
        valid: false,
        touch: false,
        validation: [required, email]
      },
      password: {
        value: '',
        valid: false,
        touch: false,
        validation: [required, length({ min: 5 })]
      }
    },
    isValidForm: false
  }

  inputChangeHandler = (inputId, value) => {
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.loginForm[inputId].validation) {
        isValid = isValid && validator(value);
      }
      const updateForm = {
        ...prevState.loginForm,
        [inputId]: {
          ...prevState.loginForm[inputId],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updateForm) {
        formIsValid = formIsValid && updateForm[inputName].valid;
      }

      return {
        loginForm: updateForm,
        isValidForm: formIsValid
      };
    });
  }

  inputBlurHandler = (inputId) => {
    this.setState(prevState => {
      return {
        loginForm: {
          ...prevState.loginForm,
          [inputId]: {
            ...prevState.loginForm[inputId],
            touch: true
          }
        }
      };
    });
  }

  render() {
    return (
      <Auth>
        <form onSubmit={e => this.props.onLogin(e, this.state)}>
          <Input
            id="email"
            label="Your E-Mail"
            type="email"
            required={required}
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'email')}
            value={this.state.loginForm['email'].value}
            valid={this.state.loginForm['email'].valid}
            touched={this.state.loginForm['email'].touch}
          />
          <Input
            id="password"
            label="Your Password"
            type="password"
            required={required}
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'password')}
            value={this.state.loginForm['password'].value}
            valid={this.state.loginForm['password'].valid}
            touched={this.state.loginForm['password'].touch} />
          <Button
            design="raised"
            type="submit"
            loading={this.props.loading}
          >Login</Button>
        </form>
      </Auth>
    );
  }
}

export default Login;
