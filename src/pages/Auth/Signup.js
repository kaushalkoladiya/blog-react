import React, { Component } from 'react';

import Input from '../../components/Form/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';

class Signup extends Component {
  state = {
    signupForm: {
      email: {
        value: '',
        valid: false,
        touch: false,
        validation: [required, email]
      },
      name: {
        value: '',
        valid: false,
        touch: false,
        validation: [required, length({ min: 2 })]
      },
      password: {
        value: '',
        valid: false,
        touch: false,
        validation: [required, length({ min: 5 })]
      },
    },
    isValidForm: false
  }

  inputChangeHandler = (inputId, value) => {
    // Here we need a previous state for validation
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.signupForm[inputId].validation) {
        isValid = isValid && validator(value);
      }
      const updateForm = {
        ...prevState.signupForm,
        [inputId]: {
          ...prevState.signupForm[inputId],
          value: value,
          valid: isValid
        }
      };
      let formIsValid = true;
      for (const inputName in updateForm) {
        formIsValid = formIsValid && updateForm[inputName].valid;
      }
      return {
        signupForm: updateForm,
        isValidForm: formIsValid
      };
    });
  };

  inputBlurHandler = inputId => {
    this.setState(prevState => {
      return {
        signupForm: {
          ...prevState.signupForm,
          [inputId]: {
            ...prevState.signupForm[inputId],
            touch: true
          }
        }
      };
    });
  };

  render() {
    return (
      <Auth>
        <form onSubmit={e => this.props.onSignup(e, this.state)}>
          <Input
            id="email"
            label="Your E-Mail"
            type="email"
            placeholder="Your E-Mail"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'email')}
            value={this.state.signupForm['email'].value}
            valid={this.state.signupForm['email'].valid}
            touched={this.state.signupForm['email'].touch}

          />
          <Input
            id="name"
            label="Your Name"
            placeholder="Your Name"
            type="text"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'name')}
            value={this.state.signupForm['name'].value}
            valid={this.state.signupForm['name'].valid}
            touched={this.state.signupForm['name'].touch}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Your Password"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'password')}
            value={this.state.signupForm['password'].value}
            valid={this.state.signupForm['password'].valid}
            touched={this.state.signupForm['password'].touch}
          />
          <Button design="raised" type="submit" loading={this.props.loading}>Signup</Button>
        </form>
      </Auth>
    );
  }
}

export default Signup;
