function sendErrorResponse(res, error, fallbackMessage = 'Erro interno do servidor.') {
    const statusCode = error.statusCode || 500
  
    return res.status(statusCode).json({
      message: statusCode === 500 ? fallbackMessage : error.message,
      ...(error.details || {})
    })
  }
  
  module.exports = {
    sendErrorResponse
  }