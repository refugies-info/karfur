interface LoginError {
  data: any
}

class LoginError extends Error {
  constructor(message: string, data?: any) {
    super(message)
    this.data = data || {};
  }
}

export default LoginError;
