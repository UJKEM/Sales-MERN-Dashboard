import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../Spinner/Spinner";

const SalesByProduct = () => {
  const limit = 10;
  const [salesByProduct, setSalesByProduct] = useState([]);
  const [mostProfitableProduct, setMostProfitableProduct] = useState();
  const [leastProfitableProduct, setLeastProfitableProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [length, setLength] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState("productId");
  const [sortAscending, setSortAscending] = useState(true);
  const [currentSpan, setCurrentSpan] = useState(1);

  const getSalesByProduct = useCallback(async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/sales/sales-by-product"
    );
    return data;
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getSalesByProduct();
        setSalesByProduct(data.result.map((obj) => obj[Object.keys(obj)[0]]));
        setLength(Math.ceil(salesByProduct.length / limit));
        setMostProfitableProduct(data.mostProfitableProduct);
        setLeastProfitableProduct(data.leastProfitableProduct);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [getSalesByProduct, salesByProduct.length]);

  // Filter function that checks brand name and category
  const filterCaseInsensitive = (data) => {
    const filterTextLower = filterText.toLowerCase();
    return data.filter(
      (row) =>
        row.brandName.toLowerCase().startsWith(filterTextLower) ||
        row.category.toLowerCase().startsWith(filterTextLower)
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

  const handleNavigation = () => {
    return (str) => {
      if (str === "Prev") {
        if (currentSpan === 1) return;
      } else if (currentSpan === length) return;
      setCurrentSpan(str === "Prev" ? currentSpan - 1 : currentSpan + 1);
      handleSaleData(currentSpan);
    };
  };

  const handleSpanClick = (n) => {
    setCurrentSpan(n);
    handleSaleData(n);
  };

  const handleSaleData = (n) =>
    setSalesByProduct([...salesByProduct].slice((n - 1) * limit, n * limit));

  return (
    <>
      {error ? (
        <p className="d-flex align-items-center justify-content-center text-white">
          {"Data may not be available. Check back later."}
        </p>
      ) : loading ? (
        <Spinner />
      ) : (
        <>
          <div className="sale-input-container">
            <h1>Sales By Product</h1>
            <input
              className="sale-product-input"
              type="text"
              placeholder="Filter by brand name and category"
              value={filterText}
              onChange={handleFilterChange}
            />
          </div>
          <div className="table-container table-responsive">
            <table className="table mb-0 table-bordered table-dark table-striped">
              <thead className="text-center">
                <tr>
                  <th data-column="sno" onClick={handleHeaderClick}>
                    S.No
                  </th>
                  <th data-column="productName" onClick={handleHeaderClick}>
                    Product Name
                  </th>
                  <th data-column="brandName" onClick={handleHeaderClick}>
                    Brand Name
                  </th>
                  <th data-column="category" onClick={handleHeaderClick}>
                    Category
                  </th>
                  <th
                    data-column="totalQuantitySold"
                    onClick={handleHeaderClick}
                  >
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
                {salesByProduct ? (
                  sortData(filterCaseInsensitive(salesByProduct)).map(
                    (row, index) => (
                      <tr key={row.productId}>
                        <td>{index + 1}</td>
                        <td>{row.productName}</td>
                        <td>{row.brandName}</td>
                        <td>{row.category}</td>
                        <td>{row.totalQuantitySold}</td>
                        <td>{row.totalRevenue.toFixed(2)}</td>
                        <td>{row.totalProfit.toFixed(2)}</td>
                      </tr>
                    )
                  )
                ) : (
                  <p className="d-flex align-items-center justify-content-center text-white">
                    {"Data may not be available. Check back later."}
                  </p>
                )}
              </tbody>
            </table>
          </div>
          <br />
          <div
            className="table-container table-responsive"
            style={{ height: "100px" }}
          >
            <p className="d-flex align-items-center justify-content-center mb-0 text-warning text-uppercase text-center bg-black">
              Most Profitable Product
            </p>
            <table className="table mb-0 table-bordered table-dark table-striped">
              <thead className="text-center">
                <tr>
                  <th>Product Name</th>
                  <th>Brand Name</th>
                  <th>Category</th>
                  <th>Total Quantity Sold</th>
                  <th>Total Revenue</th>
                  <th>Total Profit</th>
                </tr>
              </thead>
              <tbody>
                {mostProfitableProduct ? (
                  <tr>
                    <td>{mostProfitableProduct.productName}</td>
                    <td>{mostProfitableProduct.brandName}</td>
                    <td>{mostProfitableProduct.category}</td>
                    <td>{mostProfitableProduct.totalQuantitySold}</td>
                    <td>{mostProfitableProduct.totalRevenue.toFixed(2)}</td>
                    <td>{mostProfitableProduct.totalProfit.toFixed(2)}</td>
                  </tr>
                ) : (
                  <p className="d-flex align-items-center justify-content-center text-white">
                    Data for most profitable product not available. Try again
                    later.
                  </p>
                )}
              </tbody>
            </table>
          </div>
          <br />
          <div
            className="table-container table-responsive"
            style={{ height: "100px" }}
          >
            <p className="d-flex align-items-center justify-content-center mb-0 text-danger text-uppercase text-center bg-black">
              Least Profitable Product
            </p>
            <table className="table mb-0 table-bordered table-dark table-striped">
              <thead className="text-center">
                <tr>
                  <th>Product Name</th>
                  <th>Brand Name</th>
                  <th>Category</th>
                  <th>Total Quantity Sold</th>
                  <th>Total Revenue</th>
                  <th>Total Profit</th>
                </tr>
              </thead>
              <tbody>
                {leastProfitableProduct ? (
                  <tr>
                    <td>{leastProfitableProduct.productName}</td>
                    <td>{leastProfitableProduct.brandName}</td>
                    <td>{leastProfitableProduct.category}</td>
                    <td>{leastProfitableProduct.totalQuantitySold}</td>
                    <td>{leastProfitableProduct.totalRevenue.toFixed(2)}</td>
                    <td>{leastProfitableProduct.totalProfit.toFixed(2)}</td>
                  </tr>
                ) : (
                  <p className="d-flex align-items-center justify-content-center text-white">
                    Data for least profitable product not available. Try again
                    later.
                  </p>
                )}
              </tbody>
            </table>
          </div>
          <div className="span-container">
            <div className="d-flex align-items-center justify-content-center flex-wrap span-container-inner-div">
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
                  className={currentSpan === n ? "btn-active" : ""}
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
      )}
    </>
  );
};

export default SalesByProduct;
