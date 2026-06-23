import { sampleService } from '@/services/sample.service';

describe('Sample Service', () => {
  it('should return a string', () => {
    const result = sampleService();
    expect(typeof result).toBe('string');
  });
});
