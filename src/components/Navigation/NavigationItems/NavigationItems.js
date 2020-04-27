import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavigationItems.css';


const navigationItems = props => {
  const navItems = [
    { id: 'home', text: 'Home', link: "/", auth: false },
    { id: 'home', text: 'Home', link: "/", auth: true },
    { id: 'account', text: 'Account', link: `/profile/${props.userId}`, auth: true },
    { id: 'favorite', text: 'Favorite', link: "/favorite", auth: true },
    { id: 'blog', text: 'Write Blog', link: '/create/blog', auth: true },
    { id: 'login', text: 'Login', link: '/login', auth: false },
    { id: 'signup', text: 'Signup', link: '/signup', auth: false },
  ];

  return [
    ...navItems.filter(item => item.auth === props.isAuth).map(item => (
      <li
        key={item.id}
        className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')}
      >
        <NavLink to={item.link} exact onClick={props.onChoose}>
          {item.text}
        </NavLink>
      </li>
    )),
    props.isAuth && (
      <li className='navigation-item' key="logout">
        <button onClick={props.onLogout}>Logout</button>
      </li>
    )
  ];
}

export default navigationItems;
