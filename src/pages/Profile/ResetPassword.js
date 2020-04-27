import React, { Component, Fragment } from 'react';
import { Grid } from '@material-ui/core';

import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';
import Input from '../../components/Form/Input';
import { required, length } from '../../util/validators';

class UpdateProfile extends Component {
  state = {
    id: '',
    profile: {
      oldPassword: {
        value: '',
        touched: false,
        valid: false,
        validation: [required, length({ min: 5 })]
      },
      newPassword: {
        value: '',
        touched: false,
        valid: false,
        validation: [required, length({ min: 5 })]
      },
      newConfirmPassword: {
        value: '',
        touched: false,
        valid: false,
        validation: [required, length({ min: 5 })]
      }
    },
    profileLoading: false,
    isValidProfile: false,
  }

  componentDidMount() {
    const graphqlQuery = {
      query: `
        mutation {
          showUser(
              userId: { _id: "${this.props.userId}" }
              ) {
            _id
          }
        }    
      `
    };

    this.setState({ profileLoading: true });
    fetch('https://bloggraph.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.props.token}`,
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch profile.');
        }
        return res.json();
      })
      .then(({ data: { showUser: { _id } } }) => {
        this.setState({ id: _id, profileLoading: false });
      })
      .catch(this.catchError);
  }

  inputChangeHandler = (inputId, value) => {
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.profile[inputId].validation) {
        isValid = isValid && validator(value);
      }
      const updateProfile = {
        ...prevState.profile,
        [inputId]: {
          ...prevState.profile[inputId],
          valid: isValid,
          value: value
        }
      };
      let profileIsValid = true;
      for (const inputName in updateProfile) {
        profileIsValid = profileIsValid && updateProfile[inputName].valid;
      }
      return {
        profile: updateProfile,
        isValidProfile: profileIsValid
      };
    });
  }

  inputBlurHandler = (inputId) => {
    this.setState(prevState => {
      return {
        profile: {
          ...prevState.profile,
          [inputId]: {
            ...prevState.profile[inputId],
            touched: true
          }
        }
      };
    });
  }

  updatePasswordHandler = () => {
    const graphqlQuery = {
      query: `
      mutation {
        updatePassword(updatePasswordData: {
          oldPassword:"${this.state.profile.oldPassword.value}", 
          newPassword: "${this.state.profile.newPassword.value}", 
          newConfirmPassword: "${this.state.profile.newConfirmPassword.value}"
        }, 
        userId: {
          _id: "${this.state.id}"
        }) {
          result
        }
      }
          
      `
    };
    fetch('https://bloggraph.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.props.token}`,
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => res.json())
      .then((data) => {
        if (!data.data) {
          if (data.errors[0].status) {
            throw new Error(data.errors[0].message);
          }
        }
        if (data.data) {
          throw new Error('Update succesfully done.');
        }
      })
      .catch(this.catchError);
  }

  errorHandler = () => {
    this.setState({ error: null });
  }

  catchError = error => {
    this.setState({ error: error });
  }

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        {this.state.profileLoading ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Loader />
          </div>
        ) : (
            <Grid container spacing={2}>
              <Input
                id="oldPassword"
                valid={this.state.profile.oldPassword.valid}
                touched={this.state.profile.oldPassword.touched}
                onChange={this.inputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'oldPassword')}
                value={this.state.profile.oldPassword.value}
                type="password"
                required="required"
                placeholder="Your Old Password"
                label="Your old password"
              />
              <Input
                id="newPassword"
                valid={this.state.profile.newPassword.valid}
                touched={this.state.profile.newPassword.touched}
                onChange={this.inputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'newPassword')}
                value={this.state.profile.newPassword.value}
                type="password"
                required="required"
                placeholder="Your New Password"
                label="Your new password"
              />
              <Input
                id="newConfirmPassword"
                valid={this.state.profile.newConfirmPassword.valid}
                touched={this.state.profile.newConfirmPassword.touched}
                onChange={this.inputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'newConfirmPassword')}
                type="password"
                required="required"
                placeholder="Confirm Password"
                label="Confirm Password"
              />
              <Button onClick={this.updatePasswordHandler}>Update Password</Button>
            </Grid>
          )}
      </Fragment>
    );
  }

}

export default UpdateProfile;