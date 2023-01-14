import { memo, useState } from "react";

const SalesTable = (props) => {
  const limit = 50;
  const [length] = useState(Math.ceil(props.sales.length / limit));
  const [sales, setSales] = useState(props.sales.slice(0, limit));
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState("transaction_id");
  const [sortAscending, setSortAscending] = useState(true);
  const [currentSpan, setCurrentSpan] = useState(1);

  // Filter function that checks product name and brand name

  const filterCaseInsensitive = (data) => {
    let filteredTextLowerCase = filterText.toLowerCase();
    return data.filter(
      (row) =>
        String(row.total_transaction_amount)
          .toLowerCase()
          .includes(filteredTextLowerCase) ||
        row.product_id.toLowerCase().includes(filteredTextLowerCase)
    );
  };

  // Sort function
  const sortData = () => {
    setSales(
      [...sales].sort((a, b) =>
        sortAscending
          ? a[sortBy] > b[sortBy]
            ? 1
            : -1
          : a[sortBy] < b[sortBy]
          ? 1
          : -1
      )
    );
  };

  // Event handler for filter input field
  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  // Event handler for sort table headers
  const handleHeaderClick = (event) => {
    const column = event.target.getAttribute("data-column");
    if (sortBy === column) {
      setSortAscending(!sortAscending);
    } else {
      setSortBy(column);
      setSortAscending(true);
    }
    sortData();
  };

  const handleNavigation = (str) => {
    if (str === "Prev" && currentSpan !== 1) {
      handleSaleData(currentSpan - 1);
      setCurrentSpan(currentSpan - 1);
    } else if (str === "Next" && currentSpan !== length) {
      handleSaleData(currentSpan + 1);
      setCurrentSpan(currentSpan + 1);
    }
  };

  const handleSpanClick = (n) => {
    setCurrentSpan(n);
    handleSaleData(n);
  };

  const handleSaleData = (n) => {
    setSales(props.sales.slice((n - 1) * limit, n * limit));
  };

  return (
    <>
      <div className="sale-input-container">
        <input
          className="sale-input"
          type="text"
          placeholder="Filter by total transaction amount or product id"
          value={filterText}
          onChange={handleFilterChange}
        />
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th data-column="transaction_id" onClick={handleHeaderClick}>
                Transaction Id
              </th>
              <th data-column="product_id" onClick={handleHeaderClick}>
                Product Id
              </th>
              <th data-column="quantity" onClick={handleHeaderClick}>
                Quantity
              </th>
              <th
                data-column="total_transaction_amount"
                onClick={handleHeaderClick}
              >
                Total Transaction Amount
              </th>
              <th data-column="transaction_date" onClick={handleHeaderClick}>
                Transaction Date
              </th>
            </tr>
          </thead>
          <tbody>
            {sales &&
              filterCaseInsensitive(sales).map((row, index) => (
                <tr key={index}>
                  <td>{row.transaction_id}</td>
                  <td>{row.product_id}</td>
                  <td>{row.quantity}</td>
                  <td>{row.total_transaction_amount}</td>
                  <td>{row.transaction_date}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="span-container">
        <button
          style={{ visibility: currentSpan === 1 ? "hidden" : "" }}
          disabled={currentSpan === 1}
          onClick={() => handleNavigation("Prev")}
        >
          {"Prev"}
        </button>
        {Array.from({ length }, (v, k) => k + 1).map((n) => (
          <span
            className={currentSpan === n ? "span-active" : ""}
            onClick={() => handleSpanClick(n)}
            key={n}
          >
            {n}{" "}
          </span>
        ))}
        <button
          style={{ visibility: currentSpan === length ? "hidden" : "" }}
          disabled={currentSpan === length}
          onClick={() => handleNavigation("Next")}
        >
          {"Next"}
        </button>
      </div>
    </>
  );
};

export default memo(SalesTable);
