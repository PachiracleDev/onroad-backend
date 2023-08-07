import { Request } from 'express';

export default interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}
