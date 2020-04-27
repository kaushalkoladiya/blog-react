import React, { Component, Fragment } from 'react';

import Blog from '../../components/Blog/Blog';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import Loader from '../../components/Loader/Loader';

class Profile extends Component {
  state = {
    blogs: [],
    totalBlogs: 0,
    blogLoading: false,
  }

  componentDidMount() {
    const graphqlQuery = {
      query: `
        mutation {
          favList 
          {
            blogs{ _id, title, subtitle, createdAt }, totalBlogs 
          }
        }          
      `
    };

    this.setState({ blogLoading: true });
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
      .then(({ data: { favList } }) => {
        this.setState({
          blogs: favList.blogs,
          totalBlogs: favList.totalBlogs,
          blogLoading: false
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
        {this.state.blogLoading ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Loader />
          </div>
        ) : (
            this.state.blogs.map((blog, key) => {
              return (
                <Blog
                  key={key}
                  id={blog._id}
                  title={blog.title}
                  subtitle={blog.subtitle}
                  authorId={this.state.id}
                  author={this.state.name}
                  date={blog.createdAt}
                  thumbnail={true}
                />
              )
            })
          )}
      </Fragment >
    );
  }

}

export default Profile;