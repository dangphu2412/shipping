type BusinessExceptionContext = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export class BusinessException extends Error {
  code: string;
  details?: Record<string, unknown>;

  constructor({ code, message, details }: BusinessExceptionContext) {
    super(message);
    this.code = code;
    this.details = details;
  }
}
