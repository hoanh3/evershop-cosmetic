import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  useCheckout,
  useCheckoutDispatch,
} from "@components/common/context/checkout";
import { useQuery } from "urql";

const cartQuery = `
  query Query($cartId: String) {
    cart(id: $cartId) {
      billingAddress {
        cartAddressId
        fullName
        postcode
        telephone
        country {
          name
          code
        }
        province {
          name
          code
        }
        city
        address1
        address2
      }
      shippingAddress {
        cartAddressId
        fullName
        postcode
        telephone
        country {
          name
          code
        }
        province {
          name
          code
        }
        city
        address1
        address2
      }
      customerEmail
    }
  }
`;

const cardStyle = {
  style: {
    base: {
      color: "#737373",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#737373",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
  hidePostalCode: true,
};

const generateCode = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

export default function CheckoutForm({
  createPaymentSessionApi,
  pollPaymentStatusApi,
  successUrl,
}) {
  const [clientSecret, setClientSecret] = React.useState(null);
  const [showTestCard, setShowTestCard] = useState("success");
  const { steps, cartId, orderId, orderPlaced, paymentMethods } = useCheckout();
  const { placeOrder, setError } = useCheckoutDispatch();

  const [result] = useQuery({
    query: cartQuery,
    variables: {
      cartId,
    },
    pause: orderPlaced === true,
  });

  useEffect(() => {
    // Create PaymentIntent as soon as the order is placed
    if (orderId) {
      console.log(`Tạo order: ${orderId}`);
    }
  }, [orderId]);

  useEffect(() => {
    const pay = async () => {
      await placeOrder();
    };
    pay();
    // if (steps.every((step) => step.isCompleted)) {
    //   pay();
    // }
  }, [steps, orderPlaced]);

  // Gọi API tạo phiên thanh toán khi đã có orderId
  // useEffect(() => {
  //   const createPaymentSession = async () => {
  //     const res = await fetch(createPaymentSessionApi, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ order_id: orderId, cart_id: cartId }),
  //     });
  //     const data = await res.json();

  //     // Có thể redirect tới cổng thanh toán, hoặc hiển thị QR code
  //     if (data.paymentUrl) {
  //       window.open(data.paymentUrl, "_blank"); // hoặc dùng location.href nếu muốn chuyển trang luôn
  //     }

  //     // Poll trạng thái đơn hàng sau khi mở thanh toán
  //     const interval = setInterval(async () => {
  //       const checkRes = await fetch(
  //         `${pollPaymentStatusApi}?order_id=${orderId}`
  //       );
  //       const checkData = await checkRes.json();
  //       if (checkData.status === "paid") {
  //         clearInterval(interval);
  //         window.location.href = `${successUrl}/${orderId}`;
  //       }
  //     }, 3000);
  //   };

  //   if (orderPlaced && orderId) {
  //     createPaymentSession();
  //   }
  // }, [orderPlaced, orderId]);

  const paymentCode = generateCode(6);
  const content = `${paymentCode} hoantc mai dinh`;
  const bankId = "techcombank";
  const accountNumber = "1111686829";
  const accountName = "Tran Cong Hoan";
  const total = "156000";
  const urlQrCode = `https://img.vietqr.io/image/${bankId}-${accountNumber}-compact2.jpg?amount=${total}&addInfo=${content}&accountName=${accountName}`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <div className="qr-details mb-2 space-y-2 mb-4">
        <div className="flex items-baseline gap-2">
          <strong className="qr-detail-label">Ngân hàng:</strong>
          <span className="text-sm">{bankId}</span>
          <button
            type="button"
            className="text-blue-500 underline text-sm copy-icon"
            onClick={() => handleCopy(bankId)}
          >
            <span>
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.3933 22.5712H6.50649C4.68497 22.5712 3.20312 21.0894 3.20312 19.2679V8.07771C3.20312 6.25619 4.68497 4.77434 6.50649 4.77434H14.3933C16.2148 4.77434 17.6966 6.25619 17.6966 8.07771V19.2679C17.6966 21.0894 16.2148 22.5712 14.3933 22.5712ZM6.50649 6.42603C5.59579 6.42603 4.85481 7.16701 4.85481 8.07771V19.2679C4.85481 20.1786 5.59579 20.9195 6.50649 20.9195H14.3933C15.304 20.9195 16.045 20.1786 16.045 19.2679V8.07771C16.045 7.16701 15.304 6.42603 14.3933 6.42603H6.50649ZM21 17.2033V4.73305C21 2.91154 19.5182 1.42969 17.6966 1.42969H8.5298C8.07365 1.42969 7.70396 1.79938 7.70396 2.25553C7.70396 2.71168 8.07365 3.08137 8.5298 3.08137H17.6966C18.6073 3.08137 19.3483 3.82236 19.3483 4.73305V17.2033C19.3483 17.6594 19.718 18.0291 20.1742 18.0291C20.6303 18.0291 21 17.6594 21 17.2033Z"
                  fill="#262626"
                />
              </svg>
            </span>
          </button>
        </div>
        <div className="flex items-baseline gap-2">
          <strong className="qr-detail-label">Nội dung:</strong>
          <span className="text-sm">{content}</span>
          <button
            type="button"
            className="text-blue-500 underline text-sm  copy-icon"
            onClick={() => handleCopy(content)}
          >
            <span>
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.3933 22.5712H6.50649C4.68497 22.5712 3.20312 21.0894 3.20312 19.2679V8.07771C3.20312 6.25619 4.68497 4.77434 6.50649 4.77434H14.3933C16.2148 4.77434 17.6966 6.25619 17.6966 8.07771V19.2679C17.6966 21.0894 16.2148 22.5712 14.3933 22.5712ZM6.50649 6.42603C5.59579 6.42603 4.85481 7.16701 4.85481 8.07771V19.2679C4.85481 20.1786 5.59579 20.9195 6.50649 20.9195H14.3933C15.304 20.9195 16.045 20.1786 16.045 19.2679V8.07771C16.045 7.16701 15.304 6.42603 14.3933 6.42603H6.50649ZM21 17.2033V4.73305C21 2.91154 19.5182 1.42969 17.6966 1.42969H8.5298C8.07365 1.42969 7.70396 1.79938 7.70396 2.25553C7.70396 2.71168 8.07365 3.08137 8.5298 3.08137H17.6966C18.6073 3.08137 19.3483 3.82236 19.3483 4.73305V17.2033C19.3483 17.6594 19.718 18.0291 20.1742 18.0291C20.6303 18.0291 21 17.6594 21 17.2033Z"
                  fill="#262626"
                />
              </svg>
            </span>
          </button>
        </div>
        <div className="flex items-baseline gap-2">
          <strong className="qr-detail-label">Số tài khoản:</strong>
          <span className="text-sm">{accountNumber}</span>
          <button
            type="button"
            className="text-blue-500 underline text-sm copy-icon"
            onClick={() => handleCopy(accountNumber)}
          >
            <span>
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.3933 22.5712H6.50649C4.68497 22.5712 3.20312 21.0894 3.20312 19.2679V8.07771C3.20312 6.25619 4.68497 4.77434 6.50649 4.77434H14.3933C16.2148 4.77434 17.6966 6.25619 17.6966 8.07771V19.2679C17.6966 21.0894 16.2148 22.5712 14.3933 22.5712ZM6.50649 6.42603C5.59579 6.42603 4.85481 7.16701 4.85481 8.07771V19.2679C4.85481 20.1786 5.59579 20.9195 6.50649 20.9195H14.3933C15.304 20.9195 16.045 20.1786 16.045 19.2679V8.07771C16.045 7.16701 15.304 6.42603 14.3933 6.42603H6.50649ZM21 17.2033V4.73305C21 2.91154 19.5182 1.42969 17.6966 1.42969H8.5298C8.07365 1.42969 7.70396 1.79938 7.70396 2.25553C7.70396 2.71168 8.07365 3.08137 8.5298 3.08137H17.6966C18.6073 3.08137 19.3483 3.82236 19.3483 4.73305V17.2033C19.3483 17.6594 19.718 18.0291 20.1742 18.0291C20.6303 18.0291 21 17.6594 21 17.2033Z"
                  fill="#262626"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
      <span>Hoặc: </span>
      <div className="qr-image">
        <img src={urlQrCode} alt="QR Code" />
        <p className="qr-note">
          (*Chú ý: Vui lòng chuyển khoản đúng nội dung để được xác nhận thanh
          toán!)
        </p>
      </div>
    </>
  );
}

CheckoutForm.propTypes = {
  createPaymentSessionApi: PropTypes.string.isRequired, // API để tạo phiên thanh toán
  pollPaymentStatusApi: PropTypes.string.isRequired, // API để check trạng thái thanh toán
  successUrl: PropTypes.string.isRequired, // URL chuyển đến khi thành công
};
