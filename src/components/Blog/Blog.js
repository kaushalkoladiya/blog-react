import React from 'react'
import { Card, CardContent, Typography, Grid, Divider } from '@material-ui/core'

import style from './Blog.module.css';

export default (props) => {
  return (
    <Grid container specing={2} direction="row" justify="center" alignItems="center">
      <Grid item component={Card} xl={12} lg={12} md={12} sm={12} className={style.card}>
        <CardContent>
          <Typography variant="h5">Title</Typography>
          <Typography variant="subtitle1" >Subtitle with 20 characters</Typography>
          <Divider variant="middle" />

          <Typography color="textSecondary" variant="caption" className={style.justify_content_between}>
            <span>Author</span>
            <span> | </span>
            <span>Date</span>
          </Typography>

          {/* <Moment format="YYYY, MMM DD hh:mm a" date={ lastUpdate }/> */}
        </CardContent>
      </Grid>
    </Grid>
  );
}