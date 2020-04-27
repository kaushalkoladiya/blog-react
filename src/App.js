import React, { Fragment, Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Container } from '@material-ui/core'

import BlogsPage from './pages/Blogs/Blogs';
import MainNavigation from './components/Navigation/MainNavigation/MainNavigation';
import MobileNavigation from './components/Navigation/MobileNavigation/MobileNavigation';
import Backdrop from './components/Backdrop/Backdrop';
import ErrorHandler from './components/ErrorHandler/ErrorHandler';
import Layout from './components/Layout/Layout';
import Toolbar from './components/Toolbar/Toolbar';
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';
import SingleBlogPage from './pages/Blogs/Single blog/SingleBlog';
import CreateEditBlog from './pages/Blogs/Single blog/CreateEditBlog';
import Profile from './pages/Profile/Profile';
import UpdateProfilePage from './pages/Profile/UpdateProfile';
import ResetPasswordPage from './pages/Profile/ResetPassword';
import FavoriteBlogsPage from './pages/Profile/FavoriteBlogs';

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
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      this.logoutHandler();
      return;
    }
    const userId = localStorage.getItem('userId');
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    this.setState({ isAuth: true, token: token, userId: userId });
    this.setAutoLogout(remainingMilliseconds);
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
    const graphqlQuery = {
      query: `
        {
          loginUser(loginUserData: {
            email: "${loginData.loginForm.email.value}", 
            password: "${loginData.loginForm.password.value}", 
          }) {
            token, userId
          }
        }
      `
    };

    fetch('https://bloggraph.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        if (res.status !== 200) {
          throw Error('The Email or Password you entered is incorrect, please try again.');
        }
        return res.json()
      })
      .then(data => {

        if (!data.data) {
          throw Error('Could not autenticate you!');
        }
        if (data.data) {
          this.setState({
            isAuth: true,
            token: data.data.loginUser.token,
            userId: data.data.loginUser.userId,
            authLoading: false
          });
          localStorage.setItem('token', data.data.loginUser.token);
          localStorage.setItem('userId', data.data.loginUser.userId);
          const remainingMilliseconds = 60 * 60 * 1000;
          const expiryDate = new Date(
            new Date().getTime() + remainingMilliseconds
          );
          localStorage.setItem('expiryDate', expiryDate.toISOString());
          this.setAutoLogout(remainingMilliseconds);
          this.props.history.replace('/');
        }
      })
      .catch(err => {
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err
        });
      });

    this.setState({ authLoading: false });
  }

  signupHandler = (e, signupData) => {
    e.preventDefault();
    this.setState({ authLoading: true });
    const graphqlQuery = {
      query: `
        mutation {
          createUser(signupUserData: {
            email: "${signupData.signupForm.email.value}", 
            name: "${signupData.signupForm.name.value}", 
            password: "${signupData.signupForm.password.value}", 
            confirm_password: "${signupData.signupForm.password.value}"
          }) {
            result
          }
        }
      `
    };
    fetch('https://bloggraph.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ authLoading: false, isAuth: false });
        if (!data.data) {
          throw Error('Make sure email address is not used before.');
        }

        if (data.data) {
          this.props.history.replace('/login');
        }
      })
      .catch(err => {
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err
        });
      });

    this.setState({ authLoading: false });
  }

  logoutHandler = () => {
    this.setState({ isAuth: false, token: null });
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    this.props.history.replace('/');
  }

  errorHandler = () => {
    this.setState({ error: null });
  };

  setAutoLogout = milliseconds => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  render() {
    let routes = (
      <Switch>
        <Route
          path="/login"
          exact
          render={props => (
            <LoginPage
              {...props}
              onLogin={this.loginHandler}
              loading={this.state.authLoading}
            />
          )}
        />
        <Route
          path="/signup"
          exact
          render={props => (
            <SignupPage
              {...props}
              onSignup={this.signupHandler}
              loading={this.state.authLoading}
            />
          )}
        />
        <Route
          path="/"
          exact
          component={BlogsPage}
        />
        <Route
          path='/blog/:blogId'
          exact
          component={props =>
            <SingleBlogPage
              {...props}
            />
          }
        />
        <Route
          path='/profile/:userId'
          exact
          component={props =>
            <Profile
              {...props}
              isAuth={this.state.isAuth}
              userId={this.state.userId}
              token={this.state.token}
            />
          }
        />
      </Switch>
    );
    if (this.state.isAuth) {
      routes = (
        <Switch>
          <Route
            path="/"
            exact
            component={BlogsPage} />

          <Route
            path='/profile/:userId'
            exact
            component={props =>
              <Profile
                {...props}
                isAuth={this.state.isAuth}
                userId={this.state.userId}
                token={this.state.token}
              />
            }
          />
          <Route
            path='/profile/edit/:userId'
            exact
            component={props =>
              <UpdateProfilePage
                {...props}
                isAuth={this.state.isAuth}
                userId={this.state.userId}
                token={this.state.token}
              />
            }
          />
          <Route
            path='/reset/password'
            exact
            component={props =>
              <ResetPasswordPage
                {...props}
                isAuth={this.state.isAuth}
                userId={this.state.userId}
                token={this.state.token}
              />
            }
          />
          <Route
            path='/blog/:blogId'
            exact
            component={props =>
              <SingleBlogPage
                {...props}
                userId={this.state.userId}
                isAuth={this.state.isAuth}
                token={this.state.token}
              />
            }
          />
          <Route
            path='/blog/edit/:blogId'
            exact
            component={props =>
              <CreateEditBlog
                {...props}
                userId={this.state.userId}
                isAuth={this.state.isAuth}
                token={this.state.token}
              />
            }
          />
          <Route
            path='/create/blog'
            exact
            component={props =>
              <CreateEditBlog
                {...props}
                userId={this.state.userId}
                isAuth={this.state.isAuth}
                token={this.state.token}
              />
            }
          />
          <Route
            path='/favorite'
            exact
            component={props =>
              <FavoriteBlogsPage
                {...props}
                userId={this.state.userId}
                isAuth={this.state.isAuth}
                token={this.state.token}
              />
            }
          />
        </Switch>
      )
    }
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
                  userId={this.state.userId}
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
                userId={this.state.userId}
              />
            }
          />
          {routes}
        </Container>
      </Fragment>
    );
  }
}

export default withRouter(App);