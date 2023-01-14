import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link className="text-decoration-none" to="/">
              Home
            </Link>
          </li>
        </ul>
      </nav>
      <nav>
        <ul>
          <li className="right-aligned-tabs">
            <Link className="text-decoration-none" to="/sales-by-product">
              Sales by Product
            </Link>
            <Link className="text-decoration-none" to="/sales-by-brand">
              Sales by Brand
            </Link>
            <Link className="text-decoration-none" to="/highest-lowest-sales">
              Sales
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
