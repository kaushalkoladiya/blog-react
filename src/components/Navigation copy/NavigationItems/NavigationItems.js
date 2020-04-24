import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavigationItems.css';

const navItems = [
  // { id: 'blogs', name: 'Blogs', link: '/', auth: false },
  { id: 'account', name: 'Account', link: '/profile', auth: true },
  { id: 'login', name: 'Login', link: '/login', auth: false },
  { id: 'signup', name: 'Signup', link: '/signup', auth: false },
];

// here check what navItems are displayed on screen
const navigationItems = props =>
  [
    ...navItems.filter(item => item.auth === props.isAuth).map(item => (
      <li
        key={item.id}
        className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')}
      >
        <NavLink
          to={item.link}
          exact
          onClick={props.onChoose}
        >
          {item.name}
        </NavLink>
      </li>
    )),
    props.isAuth && (
      <li key="logout" className="navigation-item">
        <button onClick={props.onLogout}>Logout</button>
      </li>
    )
  ];

  // return array of navItems according to isAuth or not

export default navigationItems;