import { RequestHandler } from 'express';
import { ServerResponse } from '../types';
import { sendGreeting } from '../services/sample.service';

export const sampleController: RequestHandler<
  unknown,
  ServerResponse<{ message: string }>,
  unknown,
  unknown
> = (_req, res) => {
  const greeting = sendGreeting();

  res.status(200).json({
    success: true,
    payload: {
      message: greeting,
    },
  });
};
