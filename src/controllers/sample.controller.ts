import { RequestHandler } from 'express';
import { sendGreeting } from '../services/sample.service';

export const sampleController: RequestHandler<unknown, string, unknown, unknown> = (_req, res) => {
  const greeting = sendGreeting();
  res.status(200).send(greeting);
};
