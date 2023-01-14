import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import ProductsTable from "../Table/ProductsTable";
import SalesTable from "../Table/SalesTable";
import Spinner from "../Spinner/Spinner";

const Dashboard = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getData = useCallback(async () => {
    const { data } = await axios.get("http://localhost:4000");
    return data;
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getData();
        setSales(data["sales"]);
        setProducts(data["products"]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [getData]);

  return loading ? (
    <Spinner />
  ) : !error ? (
    <div className="dashboard-container">
      <div>
        {products ? (
          <ProductsTable products={products} error={error} />
        ) : (
          <p>
            {" "}
            Data for Product not available. Try refreshing after 60 seconds.{" "}
          </p>
        )}
      </div>
      <div>
        {sales ? (
          <SalesTable sales={sales} error={error} />
        ) : (
          <p>Data for Sales not available. Try refreshing after 90 seconds.</p>
        )}
      </div>
      <br />
      <p className="d-flex align-items-center justify-content-center text-success bg-dark text-white">
        Note: Please update the page at an interval of 60s or 90s to get the
        updated data.{" "}
      </p>
    </div>
  ) : (
    <p>{error}</p>
  );
};

export default Dashboard;
