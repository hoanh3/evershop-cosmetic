import PropTypes from "prop-types";
import React from "react";
import { useCheckout } from "@components/common/context/checkout";
import StripeLogo from "@components/frontStore/stripe/StripeLogo";
import "./QrCode.scss";
import CheckoutForm from "./CheckoutForm";

function QrCodeApp({ total }) {
  return (
    <div className="stripe__app qr-code">
      <CheckoutForm />
    </div>
  );
}

export default function QRCodeMethod({ cart: { grandTotal, currency } }) {
  const checkout = useCheckout();
  const { paymentMethods, setPaymentMethods } = checkout;

  const selectedPaymentMethod = paymentMethods?.find(
    (method) => method.selected
  );

  const isSelected = selectedPaymentMethod?.code === "qrCode";

  return (
    <div>
      <div className="flex justify-start items-center gap-4">
        {(!selectedPaymentMethod ||
          selectedPaymentMethod.code !== "qrCode") && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPaymentMethods((previous) =>
                previous.map((paymentMethod) => {
                  if (paymentMethod.code === "qrCode") {
                    return {
                      ...paymentMethod,
                      selected: true,
                    };
                  } else {
                    return {
                      ...paymentMethod,
                      selected: false,
                    };
                  }
                })
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-circle"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </a>
        )}
        {selectedPaymentMethod && selectedPaymentMethod.code === "qrCode" && (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2c6ecb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-check-circle"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        )}
        <div>
          <StripeLogo width={100} />
        </div>
      </div>
      <div>
        {selectedPaymentMethod && selectedPaymentMethod.code === "qrCode" && (
          <div className="mt-5">
            <QrCodeApp total={grandTotal.value} />
          </div>
        )}
      </div>
    </div>
  );
}

export const layout = {
  areaId: "checkoutPaymentMethodqrCode",
  sortOrder: 10,
};

export const query = `
  query Query {
    cart {
      grandTotal {
        value
      }
      currency
    }
  }
`;
