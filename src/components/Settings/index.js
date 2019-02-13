import React from "react"

import { AuthUserContext, withAuthorization } from '../Session'
import PasswordChangeForm from '../PasswordChange'

import './Settings.css'

function SettingsPage() {
  return(
    <AuthUserContext.Consumer>
      {authUser => (
        <div className="settings page">
          <h1>Настройки аккаунта</h1>
          <p class="user-email"><span className="user-email__label">Ваш Email:</span> <span className="user-email__value">{authUser.email}</span></p>
          <PasswordChangeForm />
        </div>
      )}
    </AuthUserContext.Consumer>
  )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(SettingsPage)