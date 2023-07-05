import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";
import logger from "../winston.js";
import { createPreferenceService } from "../services/payments.services.js";
import { currentSessionService } from "../services/users.services.js";
import mercadopago from "mercadopago";

export const createPreferenceController = async (req, res) => {
    try {
        // const cartID = req.params.cid
        const cart = req.body.cart
        // const currentSession = await currentSessionService(await req.session.userInfo)
        // const email = currentSession.email
        const response = await createPreferenceService(cart)
        res.json({response:response})
    } catch(error) {
        console.log(error);
    }
}

export const receiveWebhookController = async (req, res) => {
    try {
      const payment = req.query;
      console.log('payment',payment);
      if (payment.type === "payment") {
        const data = await mercadopago.payment.findById(payment["data.id"]);
        console.log('data',data);
      }
  
      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };

  export const failedPaymentController = async (req, res) => {
    try {
        console.log('esto',req.query);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };
