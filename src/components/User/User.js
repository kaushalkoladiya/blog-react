import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton';
import { Typography, Grid, Divider } from '@material-ui/core'

import style from './User.module.css';

export default (props) => {
  return (
    <>
      <Grid container direction="row" justify="flex-end">
        <Grid item xl={12} lg={12} md={12} sm={12}>
          <Typography variant="h3">Name</Typography>
          <Divider variant="middle" />
          <Divider variant="middle" />
          <div>
            <Typography variant="caption">email</Typography>
          </div>
          <Typography variant="caption" color="textSecondary">
            <span>joined at</span>
            <span> | </span>
            <span>Total blogs</span>
          </Typography>

        </Grid>
      </Grid>
    </>
  );
}
