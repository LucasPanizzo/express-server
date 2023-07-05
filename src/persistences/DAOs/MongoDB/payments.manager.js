
import config from "../../../config.js";
import CustomError from "../../../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../../../errors/errorMessages.js";
import logger from "../../../winston.js";
import nodemailer from 'nodemailer'
import { getProductsByID } from "../../persistences/ProductsPersistence.js";
import mercadopago from "mercadopago";

export default class paymentsManager {
  async createPreference(cart) {
    mercadopago.configure({
      access_token: config.tokenMP,
  });
    let items = cart.map((item) => ({
      title: item.productId.title,
      unit_price: Number(item.productId.price),
      quantity: Number(item.quantity),
      currency_id: "USD"
    }));
    let preference = {
      items: items,
      notification_url: "localhost:3030/api/payments/webhook",
      back_urls: {
        success: "http://localhost:3030/api/payments/success",
        failure: "http://localhost:3030/api/payments/fail",
        pending: "",
      },
      auto_return: "approved",
    };
    const result = await mercadopago.preferences.create(preference)
    return result
  }
  async updateCart(cart) {
    const updatedItems = await Promise.all(
      cart.map(async (item) => {
        const product = await getProductsByID(item.productId);
        const itemQuantity = await item.quantity
        return { itemQuantity, product };
      })
    );

    return updatedItems; // Devuelve el carrito actualizado
  }
}