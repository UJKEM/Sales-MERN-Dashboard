import "./App.css";
import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";

// import Welcome from "./Component/Toast/Welcome";
import Header from "./Component/Header/Header";
import Dashboard from "./Component/Dashboard/Dashboard";
import Welcome from "./Component/Toast/Welcome";

const SalesByProduct = React.lazy(() =>
  import("./Component/Table/SalesByProduct")
);
const SalesByBrand = React.lazy(() => import("./Component/Table/SalesByBrand"));
const HighestLowestSales = React.lazy(() =>
  import("./Component/Table/HighestLowestSales")
);

const App = () => {
  return (
    <div>
      <Welcome />
      <ToastContainer />
      <BrowserRouter>
        <Header />
        <Suspense
          fallback={
            <div>
              <p className="loading">Loading...</p>
            </div>
          }
        >
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route
              exact
              path="/sales-by-product"
              element={<SalesByProduct />}
            />
            <Route exact path="/sales-by-brand" element={<SalesByBrand />} />
            <Route
              exact
              path="/highest-lowest-sales"
              element={<HighestLowestSales />}
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default App;
