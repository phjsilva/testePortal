// Cria um Error com propriedade status para distinguir erros esperados (4xx) de bugs (500)
function createHttpError(statusCode, message, details = {}) {
    const error = new Error(message)
    error.statusCode = statusCode
    error.details = details
    return error
  }
  
  module.exports = {
    createHttpError
  }