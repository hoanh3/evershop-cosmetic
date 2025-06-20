const { getConfig } = require("@evershop/evershop/src/lib/util/getConfig");
const {
  getSetting,
} = require("@evershop/evershop/src/modules/setting/services/setting");

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response) => {
  // Check if Stripe is enabled
  const qrCodeConfig = getConfig("system.qrPayment.enabled", {});
  // let stripeStatus;
  if (parseInt(qrCodeConfig, 10) === 1) {
    return {
      methodCode: "qrCode",
      methodName: await getSetting(
        "qrCodeDislayName",
        "Thanh toán chuyển khoản"
      ),
    };
  } else {
    return null;
  }
};
