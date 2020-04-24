import React, { Fragment, Component } from 'react';
import { Route } from 'react-router-dom';
import { Container } from '@material-ui/core'

import axios from 'axios';

import BlogsPage from './pages/Blogs/Blogs';
import MainNavigation from './components/Navigation/MainNavigation/MainNavigation';
import MobileNavigation from './components/Navigation/MobileNavigation/MobileNavigation';
import Backdrop from './components/Backdrop/Backdrop';
import ErrorHandler from './components/ErrorHandler/ErrorHandler';
import Layout from './components/Layout/Layout';
import Toolbar from './components/Toolbar/Toolbar';
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';
import Profile from './pages/Profile/Profile';

class App extends Component {
  state = {
    showMobileNav: false,
    showBackdrop: false,
    isAuth: false,
    token: null,
    userId: null,
    authLoading: false,
    error: null
  }

  componentDidMount() {
    const query = {
      query: `
        mutation {
          createUser(signupUserData: {email: "test1@test.com", name: "A user is You", password: "12345", confirm_password: "12345"}) {
            result
          }
        }
      
      `
    };
    // axios({
    //   // url: 'http://localhost:5000/graphql',
    //   url: 'https://bloggraph.herokuapp.com/graphql',
    //   method: 'POST',
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(query)
    // })
    //   .then(data => console.log('data', data))
    //   .catch(err => console.log(err));

    fetch('https://bloggraph.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    })
      .then(res => {res.json();console.log(res)})
      .then(res => console.log('here', res))
      .catch(err => console.log(err));

  }

  mobileNavHandler = isOpen => {
    this.setState({ showBackdrop: isOpen, showMobileNav: isOpen });
  }

  backdropClickHandler = () => {
    this.setState({ showBackdrop: false, showMobileNav: false, error: null });
  };

  loginHandler = (e, loginData) => {
    e.preventDefault();
    this.setState({ authLoading: true });
    console.log(loginData);
  }

  signupHandler = (e, signupData) => {
    e.preventDefault();
    this.setState({ authLoading: true });
    const graphqlQuery = {
      query: `
        mutation {
          createUser(signupUserData: {
            email: "${signupData.signupForm.email}", 
            name: "${signupData.signupForm.name}", 
            password: "${signupData.signupForm.password}", 
            confirm_password: "${signupData.signupForm.password}"
          }) {
            result
          }
        }
      `
    };

    fetch('http://localhost:5000/graphql', {
      headers: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify(graphqlQuery)
    })
      .then(data => console.log(data))
      .catch(err => console.error(err));


    // const axiosObj = {

    // }
    // axios({
    //   method: 'POST',
    //   url: 'localhost:5000/graphql',
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   data: JSON.stringify(graphqlQuery)
    // })
    //   .then(JsonData => console.log(JsonData))
    //   .catch(data => console.log(data));
    // console.log(signupData);
  }

  logoutHandler = () => {
    this.setState({ isAuth: false, token: null });
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
  }

  errorHandler = () => {
    this.setState({ error: null });
  };


  render() {
    return (
      <Fragment>
        <Container>
          {this.state.showBackdrop && (<Backdrop onClick={this.backdropClickHandler} />)}
          <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
          <Layout
            header={
              <Toolbar>
                <MainNavigation
                  onOpenMobileNav={this.mobileNavHandler.bind(this, true)}
                  onLogout={this.logoutHandler}
                  isAuth={this.state.isAuth}
                />
              </Toolbar>
            }
            mobileNav={
              <MobileNavigation
                open={this.state.showMobileNav}
                mobile
                onChooseItem={this.mobileNavHandler.bind(this, false)}
                onLogout={this.logoutHandler}
                isAuth={this.state.isAuth}
              />
            }
          />

          <Route path="/" exact component={BlogsPage} />
          <Route
            path="/login"
            exact
            component={props =>
              <LoginPage
                {...props}
                onLogin={this.loginHandler}
                loading={this.state.authLoading}
              />
            } />
          <Route
            path="/signup"
            exact
            component={props =>
              <SignupPage
                {...props}
                onSignup={this.signupHandler}
                loading={this.state.authLoading}
              />
            } />
          <Route
            path="/profile"
            exact
            component={props =>
              <Profile
              />
            } />
        </Container>
      </Fragment>
    );
  }
}

export default App;