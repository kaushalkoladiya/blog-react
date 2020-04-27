import React, { Component, Fragment } from 'react';

import Blog from '../../components/Blog/Blog';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';


class Blogs extends Component {
  state = {
    blogs: [],
    blogPage: 1,
    totalBlogs: 0,
    blogsLoading: false
  }

  componentDidMount() {
    this.setState({ blogsLoading: true, blogs: [] });
    this.loadBlogs();
  }

  loadBlogs = direction => {
    if (direction) {
      this.setState({ blogsLoading: true, blogs: [] });
    }
    let page = this.state.blogPage;
    if (direction === 'next') {
      page++;
    }
    if (direction === 'previous') {
      page--;
    }

    const graphqlQuery = {
      query: `
        {
          blogs(page: ${page})
          {blogs{ _id, title, subtitle, createdAt, userId { name, _id } }, totalBlogs }
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
          throw new Error('Failed to fetch blogs.');
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          blogs: data.data.blogs.blogs,
          totalBlogs: data.data.blogs.totalBlogs,
          blogsLoading: false,
          blogPage: page
        });
      })
      .catch(this.catchError);
  };

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
        {this.state.blogsLoading && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Loader />
          </div>
        )}
        {this.state.blogs.length <= 0 && !this.state.blogsLoading ? (
          <p style={{ textAlign: 'center' }}>No blogs found.</p>
        ) : null}
        {!this.state.blogsLoading && (
          <Paginator
            onPrevious={this.loadBlogs.bind(this, 'previous')}
            onNext={this.loadBlogs.bind(this, 'next')}
            lastPage={Math.ceil(this.state.totalBlogs / 5)}
            currentPage={this.state.blogPage}
          >
            {this.state.blogs.map((blog, key) => (
              <Blog
                key={key}
                id={blog._id}
                author={blog.userId.name}
                authorId={blog.userId._id}
                date={blog.createdAt}
                title={blog.title}
                subtitle={blog.subtitle}
              />
            ))}
          </Paginator>
        )}
      </Fragment>
    );
  }
}

export default Blogs;