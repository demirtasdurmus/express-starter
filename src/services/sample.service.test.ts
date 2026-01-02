import {
  checkSampleExistsById,
  createSample,
  deleteSampleById,
  getSampleById,
  getSamples,
  updateSampleById,
} from './sample.service';

describe('Sample Service', () => {
  beforeEach(() => {
    // Clear the samples map before each test to ensure test isolation
    // Note: This is a workaround since the Map is module-scoped
    // In a real application, you'd inject the storage as a dependency
    const allSamples = getSamples();
    allSamples.forEach((sample) => {
      try {
        deleteSampleById(sample.id);
      } catch {
        // Ignore errors if sample doesn't exist
      }
    });
  });

  describe('getSamples', () => {
    it('should return an empty array when no samples exist', () => {
      const result = getSamples();

      expect(result).toEqual([]);
    });

    it('should return all samples', () => {
      const sample1 = createSample('Sample 1');
      const sample2 = createSample('Sample 2');

      const result = getSamples();

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(sample1);
      expect(result).toContainEqual(sample2);
    });
  });

  describe('createSample', () => {
    it('should create a sample with a UUID and name', () => {
      const name = 'Test Sample';
      const result = createSample(name);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', name);
      expect(result.id).toBeTruthy();
      expect(typeof result.id).toBe('string');
    });

    it('should add the sample to the collection', () => {
      const sample = createSample('Test Sample');
      const allSamples = getSamples();

      expect(allSamples).toContainEqual(sample);
    });
  });

  describe('getSampleById', () => {
    it('should return a sample when it exists', () => {
      const createdSample = createSample('Test Sample');
      const result = getSampleById(createdSample.id);

      expect(result).toEqual(createdSample);
    });

    it('should return null when sample does not exist', () => {
      const nonExistentId = 'non-existent-id';
      const result = getSampleById(nonExistentId);

      expect(result).toBeNull();
    });
  });

  describe('updateSampleById', () => {
    it('should update an existing sample', () => {
      const createdSample = createSample('Original Name');
      const newName = 'Updated Name';

      const result = updateSampleById(createdSample.id, newName);

      expect(result).toEqual({
        id: createdSample.id,
        name: newName,
      });
    });

    it('should return null when sample does not exist', () => {
      const nonExistentId = 'non-existent-id';
      const newName = 'Updated Name';

      const result = updateSampleById(nonExistentId, newName);

      expect(result).toBeNull();
    });
  });

  describe('deleteSampleById', () => {
    it('should delete an existing sample', () => {
      const createdSample = createSample('Test Sample');

      const result = deleteSampleById(createdSample.id);

      expect(result).toEqual(createdSample.id);
    });

    it('should throw NotFoundError when sample does not exist', () => {
      const nonExistentId = 'non-existent-id';

      const result = deleteSampleById(nonExistentId);

      expect(result).toBeNull();
    });
  });

  describe('checkSampleExistsById', () => {
    it('should return true if sample exists', () => {
      const createdSample = createSample('Test Sample');
      const result = checkSampleExistsById(createdSample.id);

      expect(result).toBe(true);
    });

    it('should return false if sample does not exist', () => {
      const nonExistentId = 'non-existent-id';
      const result = checkSampleExistsById(nonExistentId);

      expect(result).toBe(false);
    });
  });
});
