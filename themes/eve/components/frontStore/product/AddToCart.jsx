import { _ } from "@evershop/evershop/src/lib/locale/translate";
import React, { useEffect, useState } from "react";
import "./AddToCart.scss";

const AddToCart = ({ loading }) => {
  const classButton = ["button-add-cart"];

  if (loading) {
    classButton.push("loading");
  }

  return (
    <div className="add-cart">
      <button className={classButton.join(" ")}>
        <span>{_("ADD TO CART")}</span>
        {loading === true && (
          <svg
            style={{
              background: "rgb(255, 255, 255, 0)",
              display: "block",
              shapeRendering: "auto",
            }}
            width="2rem"
            height="2rem"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <circle
              cx="50"
              cy="50"
              fill="none"
              stroke="#5c5f62"
              strokeWidth="10"
              r="43"
              strokeDasharray="202.63272615654165 69.54424205218055"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="1s"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
              />
            </circle>
          </svg>
        )}
      </button>
    </div>
  );
};

export default AddToCart;

export const layout = {
  areaId: "productListingItem",
  sortOrder: 1,
};
