import { sendGreeting } from './sample.service';

describe('Sample Service', () => {
  describe('sendGreeting', () => {
    it('should return the greeting', () => {
      const result = sendGreeting();

      expect(result).toBe('Hello, World!');
    });
  });
});
