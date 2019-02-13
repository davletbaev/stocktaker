import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { SignUpLink } from '../SignUp'
import { PasswordForgetLink } from '../PasswordForget'
import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

function SignInPage() {
  return(
    <div>
      <h1>Вход</h1>
      <SignInForm />
      <PasswordForgetLink />
      <SignUpLink />
    </div>
  )
}

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
}

class SignInFormBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(event) {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.BLANKS);
      })
      .catch(error => {
        this.setState({ error })
      })

    event.preventDefault();
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return(
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="email"
          placeholder="Email"
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Пароль"
        />
        <button disabled={isInvalid} type="submit">
          Войти
        </button>

        { error && <p>{error.message}</p> }
      </form>
    )
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage

export { SignInForm }