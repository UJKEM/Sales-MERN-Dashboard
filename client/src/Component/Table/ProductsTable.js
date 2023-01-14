import { memo, useState } from "react";

const ProductsTable = (props) => {
  const limit = 10;
  const [length] = useState(Math.ceil(props.products.length / limit));
  const [products, setProducts] = useState(props.products.slice(0, limit));
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState("product_id");
  const [sortAscending, setSortAscending] = useState(true);
  const [currentSpan, setCurrentSpan] = useState(1);

  // Filter function that checks product name and category
  const filterCaseInsensitive = (data) => {
    const filterTextLower = filterText.toLowerCase();
    return data.filter(
      (row) =>
        row.product_name.toLowerCase().startsWith(filterTextLower) ||
        row.category.toLowerCase().startsWith(filterTextLower)
    );
  };

  // Sort function
  const sortData = () => {
    setProducts(
      [...products].sort((a, b) =>
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
      handleProductData(currentSpan - 1);
      setCurrentSpan(currentSpan - 1);
    } else if (str === "Next" && currentSpan !== length) {
      handleProductData(currentSpan + 1);
      setCurrentSpan(currentSpan + 1);
    }
  };

  const handleSpanClick = (n) => {
    setCurrentSpan(n);
    handleProductData(n);
  };

  const handleProductData = (n) => {
    setProducts(props.products.slice((n - 1) * limit, n * limit));
  };

  return (
    <>
      <div className="product-input-container">
        <input
          className="product-input"
          type="text"
          placeholder="Filter by product name or category"
          value={filterText}
          onChange={handleFilterChange}
        />
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th data-column="product_id" onClick={handleHeaderClick}>
                Product ID
              </th>
              <th data-column="product_name" onClick={handleHeaderClick}>
                Product Name
              </th>
              <th
                className="brand-name-column"
                data-column="brand_name"
                onClick={handleHeaderClick}
              >
                Brand Name
              </th>
              <th data-column="cost_price" onClick={handleHeaderClick}>
                Cost Price
              </th>
              <th data-column="selling_price" onClick={handleHeaderClick}>
                Selling Price
              </th>
              <th data-column="category" onClick={handleHeaderClick}>
                Category
              </th>
              <th data-column="expiry_date" onClick={handleHeaderClick}>
                Expiry Date
              </th>
            </tr>
          </thead>
          <tbody>
            {products &&
              filterCaseInsensitive(products).map((row, index) => (
                <tr key={index}>
                  <td>{row.product_id}</td>
                  <td>{row.product_name}</td>
                  <td>{row.brand_name}</td>
                  <td>{row.cost_price}</td>
                  <td>{row.selling_price}</td>
                  <td>{row.category}</td>
                  <td>{row.expiry_date}</td>
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

export default memo(ProductsTable);
