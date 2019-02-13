import React from "react"

class StockTable extends React.Component {
  render() {
    let items = this.props.items.slice();

    items = items.map(item => {
      return(
        <tr key={item.title}>
          <td className="stock-table__item-title">
            <p>{item.title}</p>
            <p>#{item.code} / {item.group}</p>
          </td>
          <td className="stock-table__item-count">{item.count || 0} {item.unit}</td>
          <td className="stock-table__item-notice">{item.notice}</td>
          <td>
            <button
              className="btn btn-default"
              onClick={() => this.props.onSelect(item)}
              title="Редактировать"
            >
              <i className="material-icons">edit</i>
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.props.onDelete(item)}
              title="Удалить"
            >
              <i className="material-icons">delete</i>
            </button>
          </td>
        </tr>
      )
    })
  
    return(
      <div className="table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              <th className="stock-table__item-title">Наименование</th>
              <th className="stock-table__item-count">Остаток</th>
              <th className="stock-table__item-notice">Заметка</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </table>
      </div>
    )
  }
}

export default StockTable