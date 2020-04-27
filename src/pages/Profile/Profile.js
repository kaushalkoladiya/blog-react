import React, { Component, Fragment } from 'react';

import User from '../../components/User/User';
import Blog from '../../components/Blog/Blog';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import Loader from '../../components/Loader/Loader';

class Profile extends Component {
  state = {
    id: '',
    name: '',
    email: '',
    createdAt: '',
    totalBlogs: 0,
    blogs: [],
    updatedAt: '',
    profileLoading: false,
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;
    const graphqlQuery = {
      query: `
        mutation {
          showUser(
              userId: { _id: "${userId}" }
              ) {
            _id, email, name, createdAt, updatedAt, blogs { title, subtitle, _id, createdAt }
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
      .then(({ data: { showUser: { _id, email, name, blogs, createdAt, updatedAt } } }) => {
        this.setState({
          id: _id,
          email: email,
          name: name,
          blogs: blogs,
          createdAt: createdAt,
          updatedAt: updatedAt,
          profileLoading: false
        });
      })
      .catch(this.catchError);
  }

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        {this.state.profileLoading ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Loader />
          </div>
        ) : (
            <User
              isAuth={this.props.isAuth}
              id={this.state.id}
              userId={this.props.userId}
              name={this.state.name}
              email={this.state.email}
              createdAt={this.state.createdAt}
              updatedAt={this.state.updatedAt}
              totalBlogs={this.state.blogs.length}
            />
          )}

        {this.state.blogs.map((blog, key) => (
          <Blog
            key={key}
            id={blog._id}
            title={blog.title}
            subtitle={blog.subtitle}
            authorId={this.state.id}
            author={this.state.name}
            date={blog.createdAt}
          />
        ))}
      </Fragment>
    );
  }

}

export default Profile;