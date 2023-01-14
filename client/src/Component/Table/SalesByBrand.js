import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const SalesByBrand = () => {
  const limit = 10;
  const [salesByBrand, setSalesByBrand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [length, setLength] = useState(0);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState("brandName");
  const [sortAscending, setSortAscending] = useState(true);
  const [currentSpan, setCurrentSpan] = useState(1);

  const getSalesByBrand = useCallback(async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/sales/sales-by-brand"
    );
    return data.result;
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getSalesByBrand();
        setSalesByBrand(data.map((obj) => obj[Object.keys(obj)[0]]));
        setLength(Math.ceil(salesByBrand.length / limit));
      } catch (err) {
        setError(err + " Try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [getSalesByBrand, salesByBrand.length]);

  // Filter function that checks product id and category
  const filterCaseInsensitive = (data) => {
    const filterTextLower = filterText.toLowerCase();
    return data.filter((row) =>
      row.brandName.toLowerCase().startsWith(filterTextLower)
    );
  };

  // Sort function
  const sortData = (data) =>
    data.sort((a, b) =>
      sortAscending
        ? a[sortBy] > b[sortBy]
          ? 1
          : -1
        : a[sortBy] < b[sortBy]
        ? 1
        : -1
    );

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
  };

  const handleNavigation = (str) => {
    if (str === "Prev") {
      if (currentSpan === 1) return;
    } else if (currentSpan === length) return;
    setCurrentSpan(str === "Prev" ? currentSpan - 1 : currentSpan + 1);
    handleSaleData(currentSpan);
  };

  const handleSpanClick = (n) => {
    setCurrentSpan(n);
    handleSaleData(n);
  };

  const handleSaleData = (n) => {
    setSalesByBrand([...salesByBrand].slice((n - 1) * limit, n * limit));
  };

  return (
    <>
      <div className="sale-input-container">
        <h1>Sales By Brand</h1>
        <input
          className="sale-brand-input"
          type="text"
          placeholder="Filter by brand name"
          value={filterText}
          onChange={handleFilterChange}
        />
      </div>
      <div className="table-container table-responsive">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <table className="table mb-0 table-bordered table-dark table-striped">
            <thead className="text-center">
              <tr>
                <th data-column="sno" onClick={handleHeaderClick}>
                  S.No
                </th>
                <th data-column="brandName" onClick={handleHeaderClick}>
                  Brand Name
                </th>
                <th data-column="mostSoldProduct" onClick={handleHeaderClick}>
                  Most Sold Product
                </th>
                <th data-column="totalQuantitySold" onClick={handleHeaderClick}>
                  Total Quantity Sold
                </th>
                <th data-column="totalRevenue" onClick={handleHeaderClick}>
                  Total Revenue
                </th>
                <th data-column="totalProfit" onClick={handleHeaderClick}>
                  Total Profit
                </th>
              </tr>
            </thead>
            <tbody>
              {salesByBrand ? (
                sortData(filterCaseInsensitive(salesByBrand)).map(
                  (row, index) => (
                    <tr key={row.brandName}>
                      <td>{index + 1}</td>
                      <td>{row.brandName}</td>
                      <td>{row.mostSoldProduct}</td>
                      <td>{row.totalQuantitySold}</td>
                      <td>{row.totalRevenue.toFixed(2)}</td>
                      <td>{row.totalProfit.toFixed(2)}</td>
                    </tr>
                  )
                )
              ) : (
                <p className="not-available">
                  Data for sales by brand not available. Try again later.
                </p>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="span-container">
        <div className="d-flex align-items-center justify-content-center span-container-inner-div">
          <button
            className="btn btn-primary"
            style={{ borderRadius: "20px" }}
            disabled={currentSpan === 1}
            onClick={() => handleNavigation("Prev")}
          >
            {"Prev"}
          </button>
          {Array.from({ length }, (v, k) => k + 1).map((n) => (
            <button
              className={currentSpan === n ? "span-active" : ""}
              style={{ backgroundColor: "rgba(15, 73, 100, 0.764)" }}
              onClick={() => handleSpanClick(n)}
              key={n}
            >
              {n}{" "}
            </button>
          ))}
          <button
            className="btn btn-primary"
            style={{ borderRadius: "20px" }}
            disabled={currentSpan === length}
            onClick={() => handleNavigation("Next")}
          >
            {"Next"}
          </button>
        </div>
      </div>
    </>
  );
};

export default SalesByBrand;
