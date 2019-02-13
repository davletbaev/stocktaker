import React from 'react'

import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import { withRouter } from 'react-router-dom'

import * as ROUTES from '../../constants/routes'

class SignOutButtonBase extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    
    this.props.firebase
      .doSignOut()
      .then(() => {
        this.props.history.push(ROUTES.SIGN_IN)
      })
  }

  render() {
    return(
      <a type="button" href="#" onClick={this.onClick}>
        Выйти
      </a>
    )
  }
}

const SignOutButton = compose(
  withRouter,
  withFirebase
)(SignOutButtonBase)

export default SignOutButton;