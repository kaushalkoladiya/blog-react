import React from 'react';
import { NavLink } from 'react-router-dom'
// import { SwipeableDrawer } from '@material-ui/core';
import './Header.css';

const Header = (props) => {
  return (
    <header className="navBar">
      <nav className="navbar-collapse navbar-toggler">
        <ul>
          <li><NavLink to="/" exact>Blogs</NavLink></li>
          <li><NavLink to="/profile" exact>Profile</NavLink></li>
          <li><NavLink to="/login" exact>Login</NavLink></li>
          <li><NavLink to="/signup" exact>Join Now</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}


export default Header;