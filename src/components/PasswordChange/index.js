import React from 'react'

import { withFirebase } from '../Firebase'

import "./PasswordChange.css"

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null
}

class PasswordChangeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  onSubmit(event) {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
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

  clearForm(event) {
    event.preventDefault();

    this.setState({ ...INITIAL_STATE })
  }

  render() {
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form onSubmit={this.onSubmit} class="password-change">
        <h3 className="password-change__title">Изменение пароля</h3>
        
        <div className="info-block password-change__form-group">
          <div className="info-block__input-group">
            <label htmlFor="passwordOne">Новый пароль</label>
            <input
              name="passwordOne"
              id="passwordOne"
              className="input"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
            />
          </div>

          <div className="info-block__input-group">
            <label htmlFor="passwordOne">Повторите новый пароль</label>
            <input
              name="passwordTwo"
              id="passwordTwo"
              className="input"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Повторите новый пароль"
            />
          </div>

          <div className="info-block__actions">
            <button
              className="btn btn-success"
              disabled={isInvalid}
              type="submit"
            >
              <i class="material-icons">done</i>
            </button>
            <button
              className="btn btn-default"
              onClick={this.clearForm}
              title="Очистить"
            >
              <i className="material-icons">close</i>
            </button>
          </div>
        </div>

        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

export default withFirebase(PasswordChangeForm);