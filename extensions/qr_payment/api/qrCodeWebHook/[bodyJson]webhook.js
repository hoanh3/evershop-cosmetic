/* eslint-disable global-require */
const {
  insert,
  startTransaction,
  commit,
  rollback,
  select,
  insertOnUpdate,
} = require("@evershop/postgres-query-builder");
const {
  getConnection,
} = require("@evershop/evershop/src/lib/postgres/connection");
const { emit } = require("@evershop/evershop/src/lib/event/emitter");
const { debug, error } = require("@evershop/evershop/src/lib/log/logger");
const {
  updatePaymentStatus,
} = require("@evershop/evershop/src/modules/oms/services/updatePaymentStatus");

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  const connection = await getConnection();
  try {
    const event = {
      type: "payment_success",
      data: {
        order_id: "dea85ddf-6c51-4eca-964d-43b458ac47e7",
        transaction_id: "TXN_001_ABCDEF",
        amount: "1990000",
        currency: "VND",
      },
    };
    await startTransaction(connection);

    const { order_id, transaction_id, amount, currency } = event.data;

    const transaction = await select()
      .from("payment_transaction")
      .where("transaction_id", "=", transaction_id)
      .load(connection);

    const order = await select()
      .from("order")
      .where("uuid", "=", order_id)
      .load(connection);

    switch (event.type) {
      case "payment_success": {
        debug("payment_success event received");

        await insertOnUpdate("payment_transaction", [
          "transaction_id",
          "payment_transaction_order_id",
        ])
          .given({
            amount: parseFloat(amount),
            payment_transaction_order_id: order.order_id,
            transaction_id,
            transaction_type: "online",
            payment_action: "Automatic",
          })
          .execute(connection);

        if (!transaction) {
          await updatePaymentStatus(order.order_id, "paid", connection);

          await insert("order_activity")
            .given({
              order_activity_order_id: order.order_id,
              comment: `Customer paid. Transaction ID: ${transaction_id}`,
            })
            .execute(connection);

          await emit("order_placed", { ...order });
        }
        break;
      }

      case "payment_authorized": {
        debug("payment_authorized event received");

        await insertOnUpdate("payment_transaction", [
          "transaction_id",
          "payment_transaction_order_id",
        ])
          .given({
            amount: parseFloat(amount),
            payment_transaction_order_id: order.order_id,
            transaction_id,
            transaction_type: "online",
            payment_action: "authorize",
          })
          .execute(connection);

        if (!transaction) {
          await updatePaymentStatus(order.order_id, "authorized", connection);

          await insert("order_activity")
            .given({
              order_activity_order_id: order.order_id,
              comment: `Customer authorized payment. Transaction ID: ${transaction_id}`,
            })
            .execute(connection);

          await emit("order_placed", { ...order });
        }
        break;
      }

      case "payment_canceled": {
        debug("payment_canceled event received");
        await updatePaymentStatus(order.order_id, "canceled", connection);
        break;
      }

      default: {
        debug(`Unhandled event type ${event.type}`);
      }
    }

    await commit(connection);
    response.json({ received: true });
  } catch (err) {
    error(err);
    await rollback(connection);
    response.status(400).send(`Error: ${err.message}`);
  }
};
