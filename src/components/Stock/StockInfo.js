import React from "react"

class StockInfo extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'date') {
      this.props.onDateChange(value);
    } else {
      this.props.onPlaceChange(value);
    }
  }
  
  render() {
    const date = this.props.date;
    const place = this.props.place;

    return(
      <div className="stock-info info-block">
        <div className="info-block__input-group">
          <label htmlFor="date">На дату:</label>
          <input
            type="text"
            id="date"
            className="input"
            name="date"
            value={date}
            onChange={this.handleChange}
          />
        </div>
  
        <div className="info-block__input-group">
          <label htmlFor="place">Склад:</label>
          <input
            type="text"
            id="place"
            className="input"
            name="place"
            value={place}
            onChange={this.handleChange}
          />
        </div>
      </div>
    )
  }
}

export default StockInfo