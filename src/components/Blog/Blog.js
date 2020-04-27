import React from 'react'
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { Card, CardContent, Typography, Grid, Divider } from '@material-ui/core'

import './Blog.css';

export default (props) => {
  return (
    !props.thumbnail ? (
      <Grid container specing={2} direction="row" justify="center" alignItems="center">
        <Grid item component={Card} xl={12} lg={12} md={12} sm={12} className="card">
          <CardContent>
            <h2>
              <Link to={`/blog/${props.id}`} >
                {props.title}
              </Link>
            </h2>
            <Typography variant="subtitle1">{props.subtitle}</Typography>
            <Divider variant="middle" />
            <Typography color="textSecondary" variant="caption">
              <span>
                <Link to={`/profile/${props.authorId}`} >
                  {props.author}
                </Link>
              </span>
              <span> | </span>
              <span>
                <Moment format="YYYY, MMM DD hh:mm a" date={props.date} />
              </span>
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    ) : (
        < Grid container specing={2} direction="row" justify="center" alignItems="center" >
          <Grid item component={Card} xl={12} lg={12} md={12} sm={12} className="cardThumbnail">
            <CardContent>
              <Link to={`/blog/${props.id}`} >
                <Typography variant="h4" color="textSecondary" gutterBottom>{props.title}</Typography>
              </Link>
              <Typography variant="body2">{props.subtitle}</Typography>
            </CardContent>
          </Grid>
        </Grid >
      )

  );
}