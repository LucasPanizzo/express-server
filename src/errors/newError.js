
export default class CustomError {
    static createCustomError({ name = 'Error', cause, message}) {
      const newError = new Error(message)
      newError.problem = `${name}: ${message},'cause:'${cause}`
      throw newError
    }
  }