import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const HighestLowestSales = () => {
  const [highestSales, setHighestSale] = useState([]);
  const [lowestSales, setLowestSale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(err + " Try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [getSalesByBrand]);

  return (
    <>
      <h1>Highest Sale</h1>
      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <table>
            <thead>
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
              {highestSales ? (
                highestSales.products &&
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
                <p>Data for highest sales not available. Try again later.</p>
              )}
            </tbody>
          </table>
        )}
      </div>
      <br />
      <h1>Lowest Sale</h1>
      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <table>
            <thead>
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
              {lowestSales &&
                lowestSales.products &&
                lowestSales.products.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.productId}</td>
                    <td>{product.productName}</td>
                    <td>{product.brandName}</td>
                    <td>{product.category}</td>
                    <td>{product.quantitySold}</td>
                    <td>{product.totalTransactionAmount.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default HighestLowestSales;
