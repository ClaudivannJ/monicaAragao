class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true; // Erros operacionais (previsíveis)
      
      // Captura do stack trace (para debugar)
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default AppError;