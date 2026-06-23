import { ConflictError, NotFoundError } from '@/lib/error';
import { deleteSampleById, getSamples } from '@/repositories/sample.repository';
import {
  createSampleService,
  deleteSampleByIdService,
  getSampleByIdService,
  getSamplesService,
  updateSampleByIdService,
} from '@/services/sample.service';

describe('Sample Service', () => {
  beforeEach(() => {
    getSamples().forEach((sample) => {
      try {
        deleteSampleById(sample.id);
      } catch {
        // ignore
      }
    });
  });

  describe('getSamplesService', () => {
    it('should return empty samples with pagination meta', () => {
      const result = getSamplesService({ page: 1, limit: 10 });

      expect(result.samples).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should return paginated samples', () => {
      createSampleService('Sample 1');
      createSampleService('Sample 2');
      createSampleService('Sample 3');

      const result = getSamplesService({ page: 1, limit: 2 });

      expect(result.samples).toHaveLength(2);
      expect(result.totalCount).toBe(3);
    });
  });

  describe('createSampleService', () => {
    it('should create a sample', () => {
      const result = createSampleService('New Sample');

      expect(result).toHaveProperty('id');
      expect(result.name).toBe('New Sample');
    });

    it('should throw ConflictError when name already exists', () => {
      createSampleService('Duplicate');

      expect(() => createSampleService('Duplicate')).toThrow(ConflictError);
    });
  });

  describe('getSampleByIdService', () => {
    it('should return a sample by id', () => {
      const created = createSampleService('Test Sample');
      const result = getSampleByIdService(created.id);

      expect(result).toEqual(created);
    });

    it('should throw NotFoundError when sample does not exist', () => {
      expect(() => getSampleByIdService('non-existent-id')).toThrow(NotFoundError);
    });
  });

  describe('updateSampleByIdService', () => {
    it('should update a sample', () => {
      const created = createSampleService('Original');
      const result = updateSampleByIdService(created.id, 'Updated');

      expect(result).toEqual({ id: created.id, name: 'Updated' });
    });

    it('should throw ConflictError when name already exists on another sample', () => {
      createSampleService('Taken Name');
      const created = createSampleService('Original');

      expect(() => updateSampleByIdService(created.id, 'Taken Name')).toThrow(ConflictError);
    });

    it('should allow renaming a sample to its own current name', () => {
      const created = createSampleService('Same Name');
      const result = updateSampleByIdService(created.id, 'Same Name');

      expect(result).toEqual({ id: created.id, name: 'Same Name' });
    });

    it('should throw NotFoundError when sample does not exist', () => {
      expect(() => updateSampleByIdService('non-existent-id', 'Updated')).toThrow(NotFoundError);
    });
  });

  describe('deleteSampleByIdService', () => {
    it('should delete a sample and return its id', () => {
      const created = createSampleService('To Delete');
      const result = deleteSampleByIdService(created.id);

      expect(result).toBe(created.id);
    });

    it('should throw NotFoundError when sample does not exist', () => {
      expect(() => deleteSampleByIdService('non-existent-id')).toThrow(NotFoundError);
    });
  });
});
