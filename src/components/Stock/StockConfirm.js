import React from "react"

function StockConfirm() {
  return(
    <div className="stock-confirm">
      <div>
        <label htmlFor="userComplete">Инвентаризацию произвел:</label>
        <input type="text" id="userComplete" name="userComplete" />
      </div>

      <div>
        <label htmlFor="userConfirm">Инвентаризацию принял:</label>
        <input type="text" id="userConfirm" name="userConfirm" />
      </div>
    </div>
  )
}

export default StockConfirm