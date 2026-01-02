import { RequestHandler } from 'express';
import { NotFoundError } from '../utils/error';
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
} from '../schemas/sample.schema';

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

  if (!sample) {
    throw new NotFoundError(req.t('samples.notFound'));
  }

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

  if (!sample) {
    throw new NotFoundError(req.t('samples.notFound'));
  }

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
  const deletedSampleId = deleteSampleById(req.params.id);

  if (!deletedSampleId) {
    throw new NotFoundError(req.t('samples.notFound'));
  }

  res.status(200).json({
    success: true,
    payload: undefined,
  });
};
