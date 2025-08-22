/* eslint-disable @typescript-eslint/no-explicit-any */

export function snakeToCamel<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel) as any;
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/_([a-z])/g, (_, g) => g.toUpperCase()),
        snakeToCamel(value)
      ])
    ) as T;
  }
  return obj;
}

export function camelToSnake<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake) as any;
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([A-Z])/g, '_$1').toLowerCase(),
        camelToSnake(value)
      ])
    ) as T;
  }
  return obj;
}