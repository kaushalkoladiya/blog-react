import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import Markdown from 'react-markdown';

import { Grid, Typography, Divider } from '@material-ui/core';

import ErrorHandler from '../../../components/ErrorHandler/ErrorHandler';
import Loader from '../../../components/Loader/Loader';
import Button from '../../../components/Button/Button';

class SingleBlog extends Component {
  state = {
    id: '',
    title: '',
    subtitle: '',
    description: '',
    createdAt: '',
    author: '',
    authorId: '',
    blogLoading: false,
    isFav: false,
  }

  componentDidMount() {
    const blogId = this.props.match.params.blogId;
    const graphqlQuery = {
      query: `
        mutation {
          showBlog(blogId: { _id: "${blogId}"} ) 
          {
            blog { _id, title, subtitle, description, userId { _id, name } }, isFav
          }
        }
      `
    };

    this.setState({ blogLoading: true });
    fetch('https://bloggraph.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.props.token}`
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch blog.');
        }
        return res.json();
      })
      .then(({ data: { showBlog: { blog, isFav } } }) => {
        this.setState({
          id: blog._id,
          title: blog.title,
          subtitle: blog.subtitle,
          description: blog.description,
          createdAt: blog.createdAt,
          author: blog.userId.name,
          authorId: blog.userId._id,
          blogLoading: false,
          isFav: isFav
        });
      })
      .catch(this.catchError);
  }

  deleteBlogHandler = () => {
    const graphqlQuery = {
      query: `
      mutation {
        deleteBlog(
          blogId: { _id: "${this.state.id}" }
          ) {
            delete
          }
        }
        `
    };

    fetch('https://bloggraph.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.props.token}`
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Action forbidden!');
        }
        return res.json();
      })
      .then((data) => {
        this.props.history.replace('/');
      })
      .catch(this.catchError);

  }

  addToFavorite = () => {
    const graphqlQuery = {
      query: `
        mutation {
          addToFav(
            blogId: { _id: "${this.state.id}" }, 
            userId: { _id: "${this.props.userId}" }
            )
          { result }
        }
        `
    };
    fetch('https://bloggraph.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.props.token}`
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Action forbidden!');
        }
        return res.json();
      })
      .then(({ data: { addToFav } }) => {
        if (addToFav.result === 'success') {
          this.setState({ isFav: true });
          throw new Error('Added to your favorite list.');
        }
      })
      .catch(this.catchError);
  }

  removeFromFavorite = () => {
    const graphqlQuery = {
      query: `
        mutation {
          removeFromFav(
            blogId: { _id: "${this.state.id}" }, 
            userId: { _id: "${this.props.userId}" }
            )
          { result }
        }
        `
    };
    fetch('https://bloggraph.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.props.token}`
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Action forbidden!');
        }
        return res.json();
      })
      .then(({ data: { removeFromFav } }) => {
        if (removeFromFav.result === 'success') {
          this.setState({ isFav: false });
          throw new Error('Remove from your favorite list.');
        }
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
        ) : (<Grid
          container
          direction="column"
          justify="space-evenly"
          alignItems="stretch"
        >
          {this.props.isAuth && this.props.userId === this.state.authorId && (
            <Typography align="left">
              <Link to={`/blog/edit/${this.state.id}`}>
                <Button design="accent" mode="flat" type="button">Edit</Button>
              </Link>
              <Button design="danger" mode="flat" onClick={this.deleteBlogHandler} type="button">Delete</Button>
            </Typography>
          )}
          <Typography variant="h2">{this.state.title}</Typography>
          <Typography variant="h5" color="primary">{this.state.subtitle}</Typography>
          <Divider variant="fullWidth" className="hr" />
          <Markdown
            escapeHtml={false}
            source={this.state.description}
          />
          <Typography color="textSecondary" variant="overline">By {this.state.author}</Typography>
          <Typography variant="overline" color="textPrimary"><Moment format="YYYY, MMM DD" date={this.state.date} /></Typography>


          {this.props.isAuth && (

            this.state.isFav ? (
              <Button onClick={this.removeFromFavorite}>Remove from favorite list</Button>
            ) : (
                <Button onClick={this.addToFavorite}>Add to favorite list</Button>
              )
          )}

        </Grid>)}

      </Fragment >
    );
  }
}

export default SingleBlog;