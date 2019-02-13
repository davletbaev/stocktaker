import React from "react"

import { compose } from 'recompose'

import { withFirebase } from '../Firebase'
import { withAuthorization } from '../Session'

import StockInfo from './StockInfo'
import StockConfirm from './StockConfirm'
import StockTable from './StockTable'
import StockEditor from './StockEditor'

import './Stock.css'

class StockPageBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      blank: null,
      itemEditing: {},
      items: [],
      error: null,
      loading: false
    }

    this.editor = React.createRef();
    this.onItemSave   = this.onItemSave.bind(this);
    this.onItemChange = this.onItemChange.bind(this);
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onItemDelete = this.onItemDelete.bind(this);
    this.onCountReset = this.onCountReset.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onPlaceChange = this.onPlaceChange.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.listener = this.props.firebase
      .doGetCurrentBlank()
      .onSnapshot(querySnapshot => {
        if (querySnapshot.size === 1) {
          querySnapshot.forEach((doc) => {
            const blankData = doc.data();

            this.setState({
              blank: doc.id,
              date: blankData.date,
              place: blankData.place,
              items: blankData.fields,
              loading: false
            })
          })
        }
      })
  }

  componentWillUnmount() {
    this.listener();
  }

  onItemChange(itemName, itemValue) {
    let itemEditing = this.state.itemEditing;

    if (itemName === 'count' && !isNaN(itemValue)) {
      itemEditing.count = +itemEditing.count || 0;

      if (!itemEditing.count && itemValue >= 0) {
        itemEditing.count = itemValue;
      } else if ((!itemEditing.count || itemEditing.count < Math.abs(itemValue)) && itemValue < 0) {
        itemEditing.count = 0;
      } else {
        itemEditing.count += +itemValue;
        itemEditing.count = Math.round(itemEditing.count * 1000) / 1000;
      }
    } else {
      itemEditing[itemName] = itemValue;
    }

    this.setState({itemEditing});
  }

  onCountReset() {
    const isResetConfirmed = window.confirm('Вы уверены, что хотите обнулить количество товара? (ВНИМАНИЕ! Эти изменения будут безвозвратно применены после сохранения товара.)');
    const itemEditing = this.state.itemEditing;

    if (isResetConfirmed) {
      itemEditing.count = 0;
      this.setState({ itemEditing });
    }
  }

  onItemSave() {
    const newItem = this.state.itemEditing;
    const blank = this.state.blank;

    let items = this.state.items;

    let itemExists = items.filter( item => item.code === newItem.code);

    if (itemExists.length > 0) {
      const isChangeConfirmed = window.confirm('Вы изменили данные товара, уже существующего в бланке, вы правда хотите перезаписать старые данные? (ВНИМАНИЕ! Эти изменения необратимы.)');

      if (isChangeConfirmed) {
        let oldItem = itemExists[0];
  
        for(let field in newItem) {
          oldItem[field] = newItem[field];
        }
      } else {
        return;
      }
    } else {
      items.push(newItem);
    }

    this.setState({
      itemEditing: {}
    });

    this.editor.current.closeEditor();

    this.props.firebase.doSaveFields(items, blank)
  }

  onItemSelect(item) {
    const itemEditing = Object.assign({}, item);
    this.setState({ itemEditing })

    this.editor.current.openEditor();
  }

  onItemDelete(removedItem) {
    let { blank, itemEditing, items } = this.state;

    items = items.filter(item => item.title !== removedItem.title);

    if (itemEditing.title === removedItem.title) {
      this.setState({
        itemEditing: {}
      });
  
      this.editor.current.closeEditor();
    }

    this.props.firebase.doSaveFields(items, blank);
  }

  onDateChange(date) {
    const blank = this.state.blank;

    this.props.firebase.doSaveBlankMetaField(blank, 'date', date);
  }

  onPlaceChange(place) {
    const blank = this.state.blank;

    this.props.firebase.doSaveBlankMetaField(blank, 'place', place);
  }

  render() {
    const { items, itemEditing, error, loading, date, place } = this.state;

    if (loading) {
      return(
        <main>
          <p>Загрузка...</p>
        </main>
      )
    } else {
      return(
        <main className="stock page">
          <h1>Инвентаризация</h1>

          { error && <p>{error.message}</p> }

          <StockInfo
            date={date}
            place={place}
            onDateChange={this.onDateChange}
            onPlaceChange={this.onPlaceChange}
          />

          <StockTable
            items={items}
            onSelect={this.onItemSelect}
            onDelete={this.onItemDelete}
          />

          <StockEditor
            ref={this.editor}
            item={itemEditing}
            onChange={this.onItemChange}
            onCountReset={this.onCountReset}
            onSave={this.onItemSave}
          />

          <StockConfirm />
        </main>
      )
    }
  }
}

const condition = authUser => !!authUser;

const StockPage = compose(
  withAuthorization(condition),
  withFirebase
)(StockPageBase);

export default StockPage