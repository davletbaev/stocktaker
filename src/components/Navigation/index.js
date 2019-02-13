import React from 'react'
import { Link } from 'react-router-dom'

import SignOutButton from '../SignOut'
import * as ROUTES from '../../constants/routes'
import { AuthUserContext } from '../Session';

import './Navigation.css'

function Navigation() {
  return(
    <nav className="nav">
      <AuthUserContext.Consumer>
        {authUser  => 
          authUser ? <NavigationAuth /> : <NavigationNonAuth />
        }
      </AuthUserContext.Consumer>
    </nav>
  )
}

function NavigationAuth() {
  return(
    <ul>
      <li className="nav__item">
        <Link to={ROUTES.BLANKS}>Бланки</Link>
      </li>
      <li className="nav__item">
        <Link to={ROUTES.SETTINGS}>Настройки</Link>
      </li>
      <li className="nav__item">
        <SignOutButton />
      </li>
    </ul>
  )
}

function NavigationNonAuth() {
  return(
    <ul>
      <li className="nav__item">
        <Link to={ROUTES.SIGN_IN}>Вход</Link>
      </li>
    </ul>
  )
}

export default Navigation