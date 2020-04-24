import React, { Component } from 'react';

import User from '../../components/User/User';
import Blogs from '../Blogs/Blogs';

import styles from './Profile.module.css';

class Profile extends Component {
  state = {
    name: '',
    email: '',
    createdAt: '',
    totalBlogs: 0
  }

  render() {
    return (
      <>
        <User />
        <Blogs />
      </>
    );
  }

}

export default Profile;