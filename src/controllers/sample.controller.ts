import { RequestHandler } from 'express';
import { TSample } from '../types/sample';
import { ServerResponse } from '../types';
import {
  createSample,
  deleteSampleById,
  getSampleById,
  getSamples,
  updateSampleById,
} from '../services/sample.service';
import {
  TCreateSampleRequestBody,
  TSampleIdParams,
  TUpdateSampleRequestBody,
} from '../schemas/sample';

export const getSamplesController: RequestHandler<
  unknown,
  ServerResponse<{ samples: TSample[] }>,
  unknown,
  unknown
> = (_req, res) => {
  const samples = getSamples();

  res.status(200).json({
    success: true,
    payload: {
      samples,
    },
  });
};

export const createSampleController: RequestHandler<
  unknown,
  ServerResponse<{ sample: TSample }>,
  TCreateSampleRequestBody,
  unknown
> = (req, res) => {
  const sample = createSample(req.body.name);

  res.status(201).json({
    success: true,
    payload: { sample },
  });
};

export const getSampleByIdController: RequestHandler<
  TSampleIdParams,
  ServerResponse<{ sample: TSample }>,
  unknown
> = (req, res) => {
  const sample = getSampleById(req.params.id);

  res.status(200).json({
    success: true,
    payload: { sample },
  });
};

export const updateSampleByIdController: RequestHandler<
  TSampleIdParams,
  ServerResponse<{ sample: TSample }>,
  TUpdateSampleRequestBody,
  unknown
> = (req, res) => {
  const sample = updateSampleById(req.params.id, req.body.name);

  res.status(200).json({
    success: true,
    payload: { sample },
  });
};

export const deleteSampleByIdController: RequestHandler<
  TSampleIdParams,
  ServerResponse,
  unknown,
  unknown
> = (req, res) => {
  deleteSampleById(req.params.id);

  res.status(200).json({
    success: true,
    payload: undefined,
  });
};
