import React, { Component, Fragment } from 'react';
import { Grid } from '@material-ui/core';

import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';
import Input from '../../components/Form/Input';
import { required, email, length } from '../../util/validators';

class UpdateProfile extends Component {
  state = {
    id: '',
    profile: {
      name: {
        value: '',
        touched: false,
        valid: false,
        validation: [required, length({ min: 2 })]
      },
      email: {
        value: '',
        touched: false,
        valid: false,
        validation: [required, email]
      },
      password: {
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
    const userId = this.props.match.params.userId;
    const graphqlQuery = {
      query: `
        mutation {
          showUser(
              userId: { _id: "${userId}" }
              ) {
            _id, email, name
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
      .then(({ data: { showUser: { _id, email, name } } }) => {
        this.setState(prevState => {
          return {
            ...prevState,
            profile: {
              ...prevState.profile,
              name: {
                ...prevState.profile.name,
                value: name,
                valid: true
              },
              email: {
                ...prevState.profile.email,
                value: email,
                valid: true
              },
            },
            id: _id,
            isValidProfile: true,
            profileLoading: false
          }
        });
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

  updateProfileHandler = () => {
    const graphqlQuery = {
      query: `
        mutation {
          updateUser(
            updateUserData: {
              email: "${this.state.profile.email.value}", 
              name:"${this.state.profile.name.value}", 
              password: "${this.state.profile.password.value}"
            },
            userId: { _id: "${this.state.id}" }
            ) {
          email, name
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
        if(data.data) {
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
              <h1>Hii, {this.state.profile.name.value}</h1>
              <Input
                id="name"
                valid={this.state.profile.name.valid}
                touched={this.state.profile.name.touched}
                onChange={this.inputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'name')}
                value={this.state.profile.name.value}
                type="text"
                required="required"
                placeholder="Your Name"
                label="Your Name"
              />
              <Input
                id="email"
                valid={this.state.profile.email.valid}
                touched={this.state.profile.email.touched}
                onChange={this.inputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'email')}
                value={this.state.profile.email.value}
                type="text"
                required="required"
                placeholder="Your E-Mail"
                label="Your E-Mail"
              />
              <Input
                id="password"
                valid={this.state.profile.password.valid}
                touched={this.state.profile.password.touched}
                onChange={this.inputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'password')}
                type="password"
                required="required"
                placeholder="Your Password"
                label="Your Password"
              />
              <Button onClick={this.updateProfileHandler}>Save</Button>
            </Grid>
          )}
      </Fragment>
    );
  }

}

export default UpdateProfile;