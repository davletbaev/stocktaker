import React from "react"
import { Link, withRouter } from "react-router-dom"
import { compose } from "recompose"

import { withFirebase } from '../Firebase'
import * as ROUTES from "../../constants/routes"

function SignUpPage() {
  return(
    <div>
      <h1>SignUp</h1>
      <SignUpForm />
    </div>
  )
}

const INITIAL_STATE = {
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null
}

class SignUpFormBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(event) {
    const { email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            email
          });
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.BLANKS)
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
    const {
      email,
      passwordOne,
      passwordTwo,
      error
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '';

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
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Пароль"
        />
        <input 
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Повторите пароль"
        />
        <button disabled={isInvalid} type="submit">
          Зарегистрироваться
        </button>

        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

function SignUpLink() {
  return(
    <p>
      Еще не зарегистрированы? <Link to={ROUTES.SIGN_UP}>Зарегистрироваться</Link>
    </p>
  )
}

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };