import React from "react";

function Logo() {
  return (
    <div className="main-logo">
      <a href="/">
        <img src="/eve.svg" alt="eve" />
      </a>
    </div>
  );
}

export default Logo;

export const layout = {
  areaId: "header",
  sortOrder: 5,
};
