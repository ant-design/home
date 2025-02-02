import type { WatermarkProps } from '.';

type KeyType = string;
export class Cache<ValueType = string> {
  cacheStore: {
    // @ts-ignore
    [key: KeyType]: ValueType;
  } = {};
  constructor() {
    // The current Cache is implemented as a simple Map, which appears to be a potential memory leak.
    // Consider switching to a limited-space cache.
    this.cacheStore = {}; // new Map();
  }

  static generateKey(
    ...args: (
      | NonNullable<WatermarkProps['content']>
      | HTMLImageElement
      | number
      | Required<NonNullable<WatermarkProps['font']>>
      | { [key: string]: unknown }
      | ({ [key: string]: unknown } | number | string)[]
      | boolean
    )[]
  ): string {
    return Array.from(args)
      .map((item) => {
        try {
          return JSON.stringify(item);
          // eslint-disable-next-line unused-imports/no-unused-vars
        } catch (e) {}
        try {
          return item.toString();
          // eslint-disable-next-line unused-imports/no-unused-vars
        } catch (e) {}
        return '';
      })
      .join();
  }

  get(key: KeyType): ValueType {
    return this.cacheStore[key as string];
  }

  set(key: KeyType, value: ValueType): ValueType {
    this.cacheStore[key] = value;
    return value;
  }
}
export default Cache;
