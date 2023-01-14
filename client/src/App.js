import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./Component/Dashboard/Dashboard";
import Header from "./Component/Header/Header";

import SalesByProduct from "./Component/Table/SalesByProduct";
import SalesByBrand from "./Component/Table/SalesByBrand";
import HighestLowestSales from "./Component/Table/HIghestLowestSales";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/sales-by-product" element={<SalesByProduct />} />
          <Route exact path="/sales-by-brand" element={<SalesByBrand />} />
          <Route
            exact
            path="/highest-lowest-sales"
            element={<HighestLowestSales />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
