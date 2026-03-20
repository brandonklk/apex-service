export class Left<L> {
  constructor(readonly value: L) {}

  isLeft(): this is Left<L> {
    return true;
  }

  isRight(): this is Right<any> {
    return false;
  }

  getLeft(): L {
    return this.value;
  }

  getRight(): never {
    throw new Error('Cannot get Right from Left');
  }
}

export class Right<R> {
  constructor(readonly value: R) {}

  isLeft(): this is Left<any> {
    return false;
  }

  isRight(): this is Right<R> {
    return true;
  }

  getRight(): R {
    return this.value;
  }

  getLeft(): never {
    throw new Error('Cannot get Left from Right');
  }
}

export type Either<L, R> = Left<L> | Right<R>;

export function left<L>(value: L): Either<L, never> {
  return new Left(value);
}

export function right<R>(value: R): Either<never, R> {
  return new Right(value);
}
