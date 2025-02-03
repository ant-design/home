/// <reference types="jest-extended" />

declare namespace jest {
  interface Matchers<R> {
    toHaveNoViolations(): R;
  }
}
