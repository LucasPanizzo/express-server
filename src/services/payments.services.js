import paymentsManager from "../persistences/DAOs/MongoDB/payments.manager.js";

const payments = new paymentsManager()

export async function createPreferenceService(preference){
    const payment = await payments.createPreference(preference)
    return payment
}
