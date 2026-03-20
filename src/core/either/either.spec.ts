import { Left, Right, left, right } from './either';

describe('Either', () => {
  describe('Left', () => {
    const errorValue = 'some error';
    let l: Left<string>;

    beforeEach(() => {
      l = new Left(errorValue);
    });

    it('should return true for isLeft', () => {
      expect(l.isLeft()).toBe(true);
    });

    it('should return false for isRight', () => {
      expect(l.isRight()).toBe(false);
    });

    it('should return the value with getLeft', () => {
      expect(l.getLeft()).toBe(errorValue);
    });

    it('should throw when calling getRight', () => {
      expect(() => l.getRight()).toThrow('Cannot get Right from Left');
    });
  });

  describe('Right', () => {
    const value = 42;
    let r: Right<number>;

    beforeEach(() => {
      r = new Right(value);
    });

    it('should return false for isLeft', () => {
      expect(r.isLeft()).toBe(false);
    });

    it('should return true for isRight', () => {
      expect(r.isRight()).toBe(true);
    });

    it('should return the value with getRight', () => {
      expect(r.getRight()).toBe(value);
    });

    it('should throw when calling getLeft', () => {
      expect(() => r.getLeft()).toThrow('Cannot get Left from Right');
    });
  });

  describe('left() helper', () => {
    it('should create a Left instance', () => {
      const l = left('error');
      expect(l).toBeInstanceOf(Left);
      expect(l.getLeft()).toBe('error');
    });
  });

  describe('right() helper', () => {
    it('should create a Right instance', () => {
      const r = right(123);
      expect(r).toBeInstanceOf(Right);
      expect(r.getRight()).toBe(123);
    });
  });
});
