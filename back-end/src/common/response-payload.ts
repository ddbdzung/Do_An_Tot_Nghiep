export class ResponsePayload implements IResponse {
  code: number;
  message: string;
  data?: any;

  constructor(code: number, message: string, data?: any) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

export class ResponsePayloadBuilder {
  private code: number;
  private message: string;
  private data: any = null;

  constructor() {}

  setCode(code: number): ResponsePayloadBuilder {
    this.code = code;
    return this;
  }

  setMessage(message: string): ResponsePayloadBuilder {
    this.message = message;
    return this;
  }

  withData(data: unknown): ResponsePayloadBuilder {
    this.data = data;
    return this;
  }

  build(): ResponsePayload {
    if (!this.code) throw new Error('Code is required');

    if (!this.message) throw new Error('Message is required');
    return new ResponsePayload(this.code, this.message, this.data);
  }
}
