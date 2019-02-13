import React from "react"

import { compose } from 'recompose'

import { withRouter } from 'react-router-dom'
import { withFirebase } from '../Firebase'
import { withAuthorization } from '../Session'

import * as ROUTES from '../../constants/routes'

import "./Blanks.css"

const INITIAL_STATE = {
  newBlankTitle: '',
  blanks: [],
  error: null,
  loading: false
}

class BlanksPageBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.clearNewBlank = this.clearNewBlank.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.listener = this.props.firebase
      .doGetBlanks()
      .onSnapshot(snapshot => {
        let blanks = [];
        
        snapshot.forEach((doc) => {
          blanks.push({ id: doc.id, data: doc.data() });
        })

        this.setState({ blanks, loading: false });
      }, error => {
        this.setState({ error, loading: false })
      })
  }

  componentWillUnmount() {
    this.listener();
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onEditBlank(blankID) {
    this.props.firebase
      .doChangeCurrentBlank(blankID)
      .then(() => {
        this.props.history.push(ROUTES.STOCK)
      })
  }
  
  onSubmit() {
    const title = this.state.newBlankTitle;

    this.props.firebase
      .doChangeCurrentBlank()
      .then(() => {
        this.props.firebase
          .doCreateBlank(title)
          .then(() => {
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.STOCK)
          });
      });
  }

  clearNewBlank() {
    this.setState({
      newBlankTitle: ''
    })
  }
  
  render() {
    const { newBlankTitle, blanks, error, loading } = this.state;

    if (loading) {
      return(
        <p>Загрузка...</p>
      );
    } else {
      return(
        <div className="blanks page">
          <h1>Бланки инвентаризаций</h1>

          <div className="info-block blanks-adder">
            <div className="info-block__input-group">
              <label htmlFor="newBlank">
                Добавить бланк:
              </label>
              <input
                id="newBlank"
                className="input"
                type="text"
                name="newBlankTitle"
                onChange={this.onChange}
                value={newBlankTitle}
              />
            </div>

            <div className="info-block__actions">
              <button
                className="btn btn-success"
                onClick={this.onSubmit}
                title="Добавить"
              >
                <i className="material-icons">done</i>
              </button>
              <button
                className="btn btn-default"
                onClick={this.clearNewBlank}
                title="Очистить"
              >
                <i className="material-icons">close</i>
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="blanks-table">
              <thead>
                <tr>
                  <th>Бланк</th>
                  <th>Дата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              
              <tbody>
                {
                  blanks.map(blank => {
                    const fields = blank.data;

                    return (<tr key={blank.id}>
                      <td>{fields.title}</td>
                      <td>{fields.date}</td>
                      <td>
                        <button
                          className="btn btn-default"
                          onClick={() => this.onEditBlank(blank.id)}
                          title="Редактировать"
                        >
                          <i className="material-icons">edit</i>
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => this.props.firebase.doRemoveBlank(blank.id)}
                          title="Удалить"
                        >
                          <i className="material-icons">delete</i>
                        </button>
                      </td>
                    </tr>)
                  })
                }
              </tbody>
            </table>
          </div>

          { error && <p>{error.message}</p> }
        </div>
      )
    }
  }
}

const condition = authUser => !!authUser;

const BlanksPage = compose(
  withAuthorization(condition),
  withFirebase,
  withRouter
)(BlanksPageBase);

export default BlanksPage