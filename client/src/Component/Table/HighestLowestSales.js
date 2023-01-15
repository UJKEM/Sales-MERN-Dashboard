import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../Spinner/Spinner";

const HighestLowestSales = () => {
  const [highestSales, setHighestSale] = useState([]);
  const [lowestSales, setLowestSale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getSalesByBrand = useCallback(async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/sales/highest-lowest-sales"
    );
    return data;
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getSalesByBrand();
        setHighestSale(data.highestSales);
        setLowestSale(data.lowestSales);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [getSalesByBrand]);

  return (
    <>
      {console.log(error)}
      <h1>Highest Sale</h1>
      <div className="table table-container table-container-hls table-responsive">
        {loading ? (
          <Spinner />
        ) : error ? (
          <p className="d-flex align-items-center justify-content-center text-white">
            {"Data may not be available now. Check back later."}
          </p>
        ) : (
          <table className="mb-0 table-bordered table-dark table-striped">
            <thead className="text-center">
              <tr>
                <th>Product Id</th>
                <th>Product Name</th>
                <th>Brand Name</th>
                <th>Category</th>
                <th>Quantity Sold</th>
                <th>Total Transaction Amount</th>
              </tr>
            </thead>
            <tbody>
              {highestSales && highestSales.products ? (
                highestSales.products.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.productId}</td>
                    <td>{product.productName}</td>
                    <td>{product.brandName}</td>
                    <td>{product.category}</td>
                    <td>{product.quantitySold}</td>
                    <td>{product.totalTransactionAmount.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <p className="not-available">
                  Data for highest sales not available. Try again later.
                </p>
              )}
            </tbody>
          </table>
        )}
      </div>
      <h1>Lowest Sale</h1>
      <div className="table table-container table-container-hls table-responsive">
        {loading ? (
          <Spinner />
        ) : error ? (
          <p className="d-flex align-items-center justify-content-center text-white">
            {"Data may not be available. Check back later."}
          </p>
        ) : (
          <table className="mb-0 table-bordered table-dark table-striped">
            <thead className="text-center">
              <tr>
                <th>Product Id</th>
                <th>Product Name</th>
                <th>Brand Name</th>
                <th>Category</th>
                <th>Quantity Sold</th>
                <th>Total Transaction Amount</th>
              </tr>
            </thead>
            <tbody>
              {lowestSales && lowestSales.products ? (
                lowestSales.products.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.productId}</td>
                    <td>{product.productName}</td>
                    <td>{product.brandName}</td>
                    <td>{product.category}</td>
                    <td>{product.quantitySold}</td>
                    <td>{product.totalTransactionAmount.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <p className="not-available">
                  Data for lowest sale not available not available. Try again
                  later.
                </p>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default HighestLowestSales;
