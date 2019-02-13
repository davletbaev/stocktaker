import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"

import Header from "../Header"
import StockPage from "../Stock"
import BlanksPage from "../Blanks"
import SettingsPage from "../Settings"
import SignUpPage from "../SignUp"
import SignInPage from "../SignIn"
import PasswordForgetPage from "../PasswordForget"

import * as ROUTES from "../../constants/routes"
import { withAuthentication } from '../Session'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {};
  }

  render() {
    return (
      <Router>
        <section>

          <Header />

          <Route path={ROUTES.STOCK} component={StockPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route exact path={ROUTES.BLANKS} component={BlanksPage} />
          <Route path={ROUTES.SETTINGS} component={SettingsPage} />
        </section>
      </Router>
    )
  }
}

export default withAuthentication(App)