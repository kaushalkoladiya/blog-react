import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import { Typography, Grid, Divider } from '@material-ui/core'
import Moment from 'react-moment';

import Button from '../Button/Button';

export default (props) => {
  return (
    <Fragment>
      <Grid container spacing={2} direction="column" justify="flex-end">
        <Grid item xl={12} lg={12} md={12} sm={12}>
          <Typography variant="h2">{props.name}</Typography>
        </Grid>
        {props.userId === props.id && (
          <Grid item xl={12} lg={12} md={12} sm={12}>
            <Typography variant="h5">{props.email}</Typography>
          </Grid>
        )}
        <Grid item xl={12} lg={12} md={12} sm={12}>
          <Typography variant="inherit" color="textSecondary">
            <span>joined at <Moment format="YYYY, MMM DD" date={props.createdAt} /></span>
            <span> | </span>
            <span>Blogs : {props.totalBlogs}</span>
            {props.userId === props.id && (
              <div>
                <Link to={`/profile/edit/${props.id}`}>
                  <Button design="accent" mode="flat" type="button">Edit Profile</Button>
                </Link>
                <Link to="/reset/password">
                  <Button design="accent" mode="flat" type="button">Reset Password</Button>
                </Link>
              </div>
            )}
          </Typography>
        </Grid>
        {props.userId === props.id && (
          <Grid item xl={12} lg={12} md={12} sm={12}>
            <Typography variant="inherit" color="inherit">
              Last you update your profile on <Moment format="YYYY, MMM DD" date={props.updatedAt} />
            </Typography>
          </Grid>
        )}
        <Grid item xl={12} lg={12} md={12} sm={12}>
          <Divider variant="middle" />
          <Divider variant="middle" />
          <Divider variant="middle" />
          <Divider variant="middle" />
        </Grid>
      </Grid>
    </Fragment>
  );
}
