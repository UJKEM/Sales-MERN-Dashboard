import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <nav>
        <ul>
          <li className="right-aligned-tabs">
            <Link to="/sales-by-product">Sales by Product</Link>
            <Link to="/sales-by-brand">Sales by Brand</Link>
            <Link to="/highest-lowest-sales">Sales</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
