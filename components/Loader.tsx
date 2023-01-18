import React from "react";

const Loader = ({ show }: { show: boolean }) => {
  return show ? <div className="loader"></div> : null;
};

export default Loader;
