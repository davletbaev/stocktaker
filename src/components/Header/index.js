import React from "react"

import Navigation from '../Navigation';

import { withAuthentication } from '../Session'

import './Header.css'

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return(
      <header>
        <div className="logo">Инвента</div>
  
        <Navigation authUser={this.state.authUser}/>
      </header>
    )
  }
}

export default withAuthentication(Header)