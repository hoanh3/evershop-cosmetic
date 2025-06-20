import PropTypes from "prop-types";
import React, { useState } from "react";
import { Name } from "@components/frontStore/catalog/product/list/item/Name";
import { Thumbnail } from "@components/frontStore/catalog/product/list/item/Thumbnail";
import { Price } from "@components/frontStore/catalog/product/list/item/Price";
import Area from "@components/common/Area";
import { get } from "@evershop/evershop/src/lib/util/get";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import AddToCart from "../../../product/AddToCart";
import { Form } from "@components/common/form/Form";
import { toast } from "react-toastify";
import { useAppDispatch, useAppState } from "@components/common/context/app";

export default function ProductList({ products = [], countPerRow = 3 }) {
  // const [loading, setLoading] = useState({});
  // const [error, setError] = useState();
  // const [toastId, setToastId] = useState();
  // const appContext = useAppState();
  // const { setData } = useAppDispatch();

  if (products.length === 0) {
    return (
      <div className="product-list">
        <div className="text-center">{_("There is no product to display")}</div>
      </div>
    );
  }

  let className;
  switch (countPerRow) {
    case 3:
      className = "grid grid-cols-2 md:grid-cols-3 gap-8";
      break;
    case 4:
      className = "grid grid-cols-2 md:grid-cols-4 gap-8";
      break;
    case 5:
      className = "grid grid-cols-2 md:grid-cols-5 gap-8";
      break;
    default:
      className = "grid grid-cols-2 md:grid-cols-3 gap-8";
  }

  // const onSuccess = (product) => (response) => {
  //   if (!response.error) {
  //     setData(
  //       produce(appContext, (draft) => {
  //         draft.cart = appContext.cart || {};
  //         draft.cart.totalQty = response.data.count;
  //         draft.cart.uuid = response.data.cartId;
  //       })
  //     );
  //     setToastId(
  //       toast(
  //         <ToastMessage
  //           thumbnail={response.data.item.thumbnail}
  //           name={product.name}
  //           qty={response.data.item.qty}
  //           count={response.data.count}
  //           cartUrl="/cart"
  //           toastId={`${toastId}-${Math.random().toString(36).slice(2)}`}
  //         />,
  //         { closeButton: false }
  //       )
  //     );
  //   } else {
  //     setError(response.error.message);
  //   }
  // };

  return (
    <div className={className}>
      {products.map((p) => (
        // <Form
        //   key={p.productId}
        //   id={`productForm-${p.productId}`}
        //   action={"addMineCartItem"}
        //   method="POST"
        //   submitBtn={false}
        //   onSuccess={onSuccess(p)}
        //   onStart={() =>
        //     setLoading((prev) => ({ ...prev, [p.productId]: true }))
        //   }
        //   onComplete={() =>
        //     setLoading((prev) => ({ ...prev, [p.productId]: false }))
        //   }
        //   onError={(e) => setError(e.message)}
        //   isJSON
        // >
        //   <input type="hidden" name="sku" value={p.sku} />
        //   <input type="hidden" name="qty" value="1" />
        <Area
          id="productListingItem"
          className="listing-tem"
          product={p}
          key={p.productId}
          coreComponents={[
            {
              component: { default: Thumbnail },
              props: {
                url: p.url,
                imageUrl: get(p, "image.url"),
                alt: p.name,
              },
              sortOrder: 10,
              id: "thumbnail",
            },
            {
              component: { default: Name },
              props: { name: p.name, url: p.url, id: p.productId },
              sortOrder: 20,
              id: "name",
            },
            {
              component: { default: Price },
              props: { ...p.price },
              sortOrder: 30,
              id: "price",
            },
            // {
            //   component: { default: AddToCart },
            //   props: { loading: loading[p.productId] },
            //   sortOrder: 40,
            //   id: "add-to-cart",
            // },
          ]}
        />
      ))}
    </div>
  );
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      sku: PropTypes.string,
      productId: PropTypes.number,
      url: PropTypes.string,
      price: PropTypes.shape({
        regular: PropTypes.shape({
          value: PropTypes.number,
          text: PropTypes.string,
        }),
        special: PropTypes.shape({
          value: PropTypes.number,
          text: PropTypes.string,
        }),
      }),
      image: PropTypes.shape({
        alt: PropTypes.string,
        listing: PropTypes.string,
      }),
    })
  ).isRequired,
  countPerRow: PropTypes.number.isRequired,
};

// export const query = `
//   query Query {
//     product(id: getContextValue('productId')) {
//       productId
//       sku
//       name
//       gallery {
//         thumb
//       }
//       inventory {
//         isInStock
//       }
//     }
//     action:url (routeId: "addMineCartItem")
//   }
// `;
