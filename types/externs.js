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
 * @typedef {{ result: boolean, reason: string, mtime: number, hash: !Array<string>, md5: string }}
 */
_depack.CacheResult
