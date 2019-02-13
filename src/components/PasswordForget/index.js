import React from "react"
import { Link } from 'react-router-dom'

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

function PasswordForgetPage() {
  return(
    <div>
      <h1>Сброс пароля</h1>
      <PasswordForgetForm />
    </div>
  )
}

const INITIAL_STATE = {
  email: '',
  error: null
}

class PasswordForgetFormBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(event) {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE })
      })
      .catch(error => {
        this.setState({ error })
      })

    event.preventDefault();
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { email, error } = this.state;

    const isInvalid = email === '';

    return(
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          type="email"
          placeholder="Email"
        />

        <button disabled={isInvalid} type="submit">
          Сбросить пароль
        </button>

        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

function PasswordForgetLink() {
  return(
    <p>
      <Link to={ROUTES.PASSWORD_FORGET}>Забыли пароль?</Link>
    </p>
  )
}

export default PasswordForgetPage

const PasswordForgetForm = withFirebase(PasswordForgetFormBase)

export { PasswordForgetForm, PasswordForgetLink }