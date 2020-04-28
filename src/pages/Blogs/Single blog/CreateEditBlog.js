import React, { Component, Fragment } from 'react';
import Moment from 'react-moment';
import Markdown from 'react-markdown';

import { Grid, Typography, Divider } from '@material-ui/core';

import { length, required } from '../../../util/validators';

import ErrorHandler from '../../../components/ErrorHandler/ErrorHandler';
import Loader from '../../../components/Loader/Loader';
import Textarea from '../../../components/Form/Textarea';
import Button from '../../../components/Button/Button';

class CreateEditBlog extends Component {
  state = {
    blog: {
      title: {
        value: '',
        valid: false,
        touch: false,
        validation: [required, length({ min: 5 })]
      },
      subtitle: {
        value: '',
        valid: false,
        touch: false,
        validation: [required, length({ min: 5 })]
      },
      description: {
        value: '',
        valid: false,
        touch: false,
        validation: [required, length({ min: 20 })]
      },
    },
    id: '',
    isValidBlog: false,
    updatedAt: '',
    author: '',
    authorId: '',
    blogLoading: false,
    isBlogCreatePage: false,
  }

  componentDidMount() {
    const blogId = this.props.match.params.blogId;
    if (!blogId) {
      this.setState({ isBlogCreatePage: true });
      return;
    }
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
          throw new Error('Failed to fetch.');
        }
        return res.json();
      })
      .then(({ data: { showBlog: { blog, isFav } } }) => {
        this.setState({
          blog: {
            title: {
              ...this.state.blog.title,
              value: blog.title,
              valid: true
            },
            subtitle: {
              ...this.state.blog.subtitle,
              value: blog.subtitle,
              valid: true
            },
            description: {
              ...this.state.blog.description,
              value: blog.description,
              valid: true
            },
          },
          id: blog._id,
          updatedAt: blog.updatedAt,
          author: blog.userId.name,
          authorId: blog.userId._id,
          blogLoading: false,
          isValidBlog: true,
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

  inputChangeHandler = (inputId, value) => {
    // Here we need a previous state for validation
    // console.log(this.state);
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.blog[inputId].validation) {
        isValid = isValid && validator(value);
      }
      const updateBlog = {
        ...prevState.blog,
        [inputId]: {
          ...prevState.blog[inputId],
          value: value,
          valid: isValid
        }
      };
      let blogIsValid = true;
      for (const inputName in updateBlog) {
        blogIsValid = blogIsValid && updateBlog[inputName].valid;
      }

      return {
        blog: updateBlog,
        isValidBlog: blogIsValid
      };
    });
  };

  inputBlurHandler = inputId => {

    this.setState({
      ...this.state,
      blog: {
        ...this.state.blog,
        [inputId]: {
          ...this.state.blog[inputId],
          touch: true,
        }
      }
    });

    // this.setState(prevState => {
    //   const blog = {
    //     blog: {
    //       ...prevState.blog,
    //       [inputId]: {
    //         ...prevState.blog[inputId],
    //         touch: true
    //       }
    //     }
    //   };
    //   console.log(blog);
    //   return {
    //     blog: blog
    //   };
    // });
  };

  updateBlogHandler = () => {
    fetch('https://bloggraph.herokuapp.com/blog/update/' + this.state.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.props.token}`
      },
      body: JSON.stringify({
        title: this.state.blog.title.value,
        subtitle: this.state.blog.subtitle.value,
        description: this.state.blog.description.value,
      })
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Fail to Update Blog.');
        }
        return res.json();
      })
      .then(({ blog }) => {
        console.log(blog);
        throw new Error('Update successfully done.')
      })
      .catch(this.catchError);
  }

  createBlogHandler = () => {
    fetch('https://bloggraph.herokuapp.com/blog/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.props.token}`
      },
      body: JSON.stringify({
        title: this.state.blog.title.value,
        subtitle: this.state.blog.subtitle.value,
        description: this.state.blog.description.value,
      })
    })
      .then(res => {
        if (res.status === 402) {
          throw new Error('Validation Failed');
        }
        if (res.status !== 200) {
          throw new Error('Fail to Create Blog.');
        }
        return res.json();
      })
      .then((data) => {
        if (data.result === 'success') {
          throw new Error('Blog create successfully.')
        }
      })
      .catch(this.catchError);
  }


  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />

        {this.state.isBlogCreatePage && (
          <h1>Write your blog here!</h1>
        )}

        {this.state.blogLoading ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Loader />
          </div>
        ) :

          (<Grid
            container
            direction="column"
            justify="space-evenly"
            alignItems="stretch"
            spacing={3}
          >

            {!this.state.isBlogCreatePage && (<Grid item xl={12} lg={12} sm={12} md={12}>
              <Typography color="textSecondary" variant="caption">
                Last change : <Moment format="YYYY, MMM DD hh:mm a" date={this.state.updatedAt} />
              </Typography>
            </Grid>)}

            <Grid item xl={12} lg={12} sm={12} md={12}>
              <Textarea
                value={this.state.blog.title.value}
                touch={this.state.blog.title.touch}
                valid={this.state.blog.title.valid}
                placeholder="Write Blog's titile in minimum 5 characters"
                row={3}
                id="title"
                label="Title"
                required="required"
                onChange={this.inputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'title')}
              />
            </Grid>
            <Grid item xl={12} lg={12} sm={12} md={12}>
              <Textarea
                value={this.state.blog.subtitle.value}
                touch={this.state.blog.subtitle.touch}
                valid={this.state.blog.subtitle.valid}
                placeholder="Write Blog's subtitle in minimum 5 characters"
                row={3}
                id="subtitle"
                label="SubTitle"
                required="required"
                onChange={this.inputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'subtitle')}
              />
            </Grid>
            <Divider variant="fullWidth" />

            <Grid item xl={12} lg={12} sm={12} md={12}>
              <Typography>Preview</Typography>
            </Grid>
            <Grid item xl={12} lg={12} sm={12} md={12}>
              <Markdown
                escapeHtml={false}
                source={this.state.blog.description.value}
              />
            </Grid>

            <Divider variant="fullWidth" />
            <Grid item xl={12} lg={12} sm={12} md={12}>
              <Textarea
                value={this.state.blog.description.value}
                touch={this.state.blog.description.touch}
                valid={this.state.blog.description.valid}
                placeholder="Write Blog's description in minimum 20 characters. You can use Markdown as well as HTML tags."
                id="description"
                rows="50"
                label="Description"
                required="required"
                onChange={this.inputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, 'description')}
              />
            </Grid>

            <Grid item xl={12} lg={12} sm={12} md={12}>
              {this.state.isBlogCreatePage ? (
                <Button onClick={this.createBlogHandler}>Create</Button>
              ) : (
                  <Button onClick={this.updateBlogHandler}>Save</Button>
                )}

            </Grid>
          </Grid>)
        }

      </Fragment>
    );
  }
}

export default CreateEditBlog;