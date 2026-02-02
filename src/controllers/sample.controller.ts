import { RequestHandler } from 'express';
import { getPaginationMeta } from '../utils/get-pagination-meta';
import { NotFoundError } from '../utils/error';
import { TGetSamplesResponse, TSample } from '../types/sample';
import {
  createSample,
  deleteSampleById,
  getSampleById,
  getSamples,
  updateSampleById,
} from '../services/sample.service';
import {
  TCreateSampleRequestBody,
  TGetSamplesQuery,
  TSampleIdParams,
  TUpdateSampleRequestBody,
} from '../schemas/sample.schema';

export const getSamplesController: RequestHandler<unknown, TGetSamplesResponse> = (req, res) => {
  const query = req.query as TGetSamplesQuery;
  const { page = 1, limit = 10 } = query;

  const allSamples = getSamples();
  const paginatedSamples = allSamples.slice((page - 1) * limit, page * limit);

  res.status(200).json({
    ...getPaginationMeta({ page, limit, totalCount: allSamples.length }),
    samples: paginatedSamples,
  });
};

export const createSampleController: RequestHandler<unknown, TSample, TCreateSampleRequestBody> = (
  req,
  res,
) => {
  const sample = createSample(req.body.name);

  res.status(201).json(sample);
};

export const getSampleByIdController: RequestHandler<TSampleIdParams, TSample> = (req, res) => {
  const sample = getSampleById(req.params.id);

  if (!sample) {
    throw new NotFoundError(req.t('samples.notFound'));
  }

  res.status(200).json(sample);
};

export const updateSampleByIdController: RequestHandler<
  TSampleIdParams,
  TSample,
  TUpdateSampleRequestBody
> = (req, res) => {
  const sample = updateSampleById(req.params.id, req.body.name);

  if (!sample) {
    throw new NotFoundError(req.t('samples.notFound'));
  }

  res.status(200).json(sample);
};

export const deleteSampleByIdController: RequestHandler<TSampleIdParams> = (req, res) => {
  const deletedSampleId = deleteSampleById(req.params.id);

  if (!deletedSampleId) {
    throw new NotFoundError(req.t('samples.notFound'));
  }

  res.status(204).json();
};
