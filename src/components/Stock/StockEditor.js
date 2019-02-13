import React from "react"

class StockEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorOpened: false,
      countChange: '',
      error: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCountChange = this.handleCountChange.bind(this);
    this.resetCount = this.resetCount.bind(this);
    this.openEditor = this.openEditor.bind(this);
    this.closeEditor = this.closeEditor.bind(this);
    this.saveItem     = this.saveItem.bind(this);
  }

  componentDidMount() {
    this.timer = null;
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;

    this.props.onChange(itemName, itemValue);
  }

  handleCountChange(e) {
    clearTimeout(this.timer);

    const itemName = e.target.name;
    const itemValue = +e.target.value;
    const unitCapacity = this.props.item.unitCapacity;

    this.setState({ countChange: itemValue });

    this.timer = setTimeout(() => {
      let calculatedValue = 0;
      
      if (isNaN(itemValue)) {
        this.setState({ error: 'Введите числовое значение' });
        return;
      }
  
      if (isFloat(itemValue)) {
        calculatedValue = itemValue;
      } else {
        calculatedValue = itemValue * unitCapacity;
        calculatedValue = Math.round(calculatedValue * 1000) / 1000;
      }

      this.setState({ countChange: '' });
      this.props.onChange(itemName, calculatedValue);
    }, 1000)
  }

  resetCount(e) {
    debugger;
    e.preventDefault();
    this.props.onCountReset();
  }

  saveItem(e) {
    e.preventDefault();

    const { title, group, code, unit } = this.props.item;

    if (!title || !group || !code || !unit) {
      this.setState({ error: 'Заполните все необходимые поля.' })
      return;
    }

    this.props.onSave();
  }

  openEditor() {
    this.setState({
      editorOpened: true
    })
  }

  closeEditor() {
    this.setState({
      editorOpened: false
    })
  }

  render() {
    const { error, editorOpened } = this.state;

    const item = {
      title: this.props.item.title,
      group: this.props.item.group,
      code: this.props.item.code,
      unit: this.props.item.unit,
      unitCapacity: this.props.item.unitCapacity,
      count: this.props.item.count || 0,
      countChange: this.state.countChange,
      notice: this.props.item.notice
    }

    const isDisabled = !item.unitCapacity || isNaN(item.unitCapacity);

    return (
      <div className={ editorOpened ? 'editor open' : 'editor' }>
        { editorOpened && 
          <button
            className="btn floating btn-success"
            onClick={this.saveItem}
            title="Сохранить"
          >
            <i className="material-icons">done</i>
          </button>
        }
        <button
          className={ editorOpened ? "btn floating btn-default" : "btn floating" }
          onClick={ editorOpened ? this.closeEditor : this.openEditor }
          title={ editorOpened ? 'Добавить товар' : 'Отмена' }
        >
          <i className="material-icons">{ editorOpened ? 'close' : 'add' }</i>
        </button>

        { editorOpened &&
          <div>
            <form className="editor-form">
              <div className="title-group">
                <label htmlFor="itemTitle">Наименование<span className="required">*</span>:</label>
                <input
                  type="text"
                  id="itemTitle"
                  className="input"
                  name="title"
                  value={item.title}
                  onChange={this.handleChange}/>
              </div>

              <div className="itemgroup-group">
                <label htmlFor="itemGroup">Группа<span className="required">*</span>:</label>
                <input
                  type="text"
                  id="itemGroup"
                  className="input"
                  name="group"
                  value={item.group}
                  onChange={this.handleChange}/>
              </div>

              <div className="code-group">
                <label htmlFor="itemCode">Код товара<span className="required">*</span>:</label>
                <input
                  type="text"
                  id="itemCode"
                  className="input"
                  name="code"
                  value={item.code}
                  onChange={this.handleChange}/>
              </div>

              <div className="unit-group">
                <label htmlFor="itemUnit">Ед.измерения<span className="required">*</span>:</label>
                <input
                  type="text"
                  id="itemUnit"
                  className="input"
                  name="unit"
                  value={item.unit}
                  onChange={this.handleChange}/>
              </div>

              <div>
                <label htmlFor="itemUnitCapacity">Объем целого:</label>
                <input
                  type="number"
                  id="itemUnitCapacity"
                  className="input"
                  name="unitCapacity"
                  min="0"
                  value={item.unitCapacity}
                  onChange={this.handleChange}/>
              </div>

              <div className="count-group">
                <label htmlFor="itemCount">Остаток:</label>
                <input
                  className="readonly input"
                  type="text"
                  value={item.count}
                  readOnly={ true }/>
                <input
                  type="number"
                  id="itemCount"
                  className="input"
                  name="count"
                  disabled={ isDisabled }
                  onMouseEnter={ isDisabled ? () => this.setState({ error: 'Сначала введите объем единицы. Укажите "1" для развесного и штучного товара.' }) : null }
                  onMouseLeave={ () => this.setState({ error: null }) }
                  value={item.countChange}
                  onChange={this.handleCountChange}
                />
                <button
                  className="btn btn-default"
                  onClick={this.resetCount}
                  title="Обнулить количество"
                >
                  <i className="material-icons">exposure_zero</i>
                </button>
              </div>

              <div>
                <label htmlFor="itemNotice">Заметка</label>
                <input
                  type="text"
                  id="itemNotice"
                  className="input"
                  name="notice"
                  value={item.notice}
                  onChange={this.handleChange}/>
              </div>

              { error && <div className="form-error">{ error }</div> }
            </form>
          </div>
        }
      </div>
    )
  }
}


function isFloat(n){
  return Number(n) === n && n % 1 !== 0;
}

export default StockEditor