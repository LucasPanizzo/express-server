import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";
import logger from "../winston.js";
import { createPreferenceService } from "../services/payments.services.js";

export const createPreferenceController = async (req, res) => {
    try {
        const cart = req.body.cart
        const response = await createPreferenceService(cart)
        res.json({response:response})
    } catch(error) {
        console.log(error);
    }
}


  export const failedPaymentController = async (req, res) => {
    try {
      res.render('failedPayment')
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };
