import React from "react";

import { ColorRing } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#b8c480", "#B2A3B5", "#F4442E", "#51E5FF", "#429EA6"]}
      />
    </div>
  );
};

export default Spinner;
