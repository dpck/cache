/**
 * @fileoverview
 * @externs
 */

/* typal types/index.xml externs */
/** @const */
var _depack = {}
/**
 * Interface for the cache object.
 * @typedef {!Object<string, _depack.CacheEntry>}
 */
_depack.Cache
/**
 * A single entry in the cache.
 * @typedef {{ mtime: number, hash: !Array<string> }}
 */
_depack.CacheEntry
/**
 * The return type of the program.
 * @typedef {{ result: boolean, reason: (string|undefined), mtime: (number|undefined), currentMtime: (number|undefined), hash: ((!Array<string>)|undefined), md5: string }}
 */
_depack.CacheResult

/* typal types/api.xml externs */
/**
 * Checks the entry file's `mtime`, calculates its dependencies and compare against the values stored in the cache object. When the result is negative, the cache object must be updated with the result returned by the function.
 * @typedef {function(string,!_depack.Cache=,!Function=): !Promise<!_depack.CacheResult>}
 */
_depack.compare
