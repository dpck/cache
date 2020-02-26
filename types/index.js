export {}

/* typal types/api.xml namespace */
/**
 * @typedef {_depack.compare} compare Checks the entry file's `mtime`, calculates its dependencies and compare against the values stored in the cache object. When the result is negative, the cache object must be updated with the result returned by the function.
 * @typedef {(path: string, cache?: !_depack.Cache, log?: !Function) => !_depack.CacheResult} _depack.compare Checks the entry file's `mtime`, calculates its dependencies and compare against the values stored in the cache object. When the result is negative, the cache object must be updated with the result returned by the function.
 */

/**
 * @typedef {import('..').Cache} _depack.Cache
 * @typedef {import('..').CacheResult} _depack.CacheResult
 */
