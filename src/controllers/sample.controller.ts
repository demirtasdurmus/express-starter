import type { RequestHandler } from 'express';

import type {
  TCreateSampleRequestBody,
  TGetSamplesQuery,
  TSampleIdParams,
  TUpdateSampleRequestBody,
} from '@/schemas/sample.schema';
import {
  createSampleService,
  deleteSampleByIdService,
  getSampleByIdService,
  getSamplesService,
  updateSampleByIdService,
} from '@/services/sample.service';
import type { TGetSamplesResponse, TSample } from '@/types/sample';

export const getSamplesController: RequestHandler<unknown, TGetSamplesResponse> = (req, res) => {
  const query = req.query as TGetSamplesQuery;

  const samplesResponse = getSamplesService(query);

  res.status(200).json(samplesResponse);
};

export const createSampleController: RequestHandler<unknown, TSample, TCreateSampleRequestBody> = (
  req,
  res,
) => {
  const sample = createSampleService(req.body.name);

  res.status(201).json(sample);
};

export const getSampleByIdController: RequestHandler<TSampleIdParams, TSample> = (req, res) => {
  const sample = getSampleByIdService(req.params.id);

  res.status(200).json(sample);
};

export const updateSampleByIdController: RequestHandler<
  TSampleIdParams,
  TSample,
  TUpdateSampleRequestBody
> = (req, res) => {
  const sample = updateSampleByIdService(req.params.id, req.body.name);

  res.status(200).json(sample);
};

export const deleteSampleByIdController: RequestHandler<TSampleIdParams> = (req, res) => {
  deleteSampleByIdService(req.params.id);

  res.status(204).json();
};
