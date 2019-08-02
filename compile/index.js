const _compare = require('./cache')

/**
 * Computes Necessary Information To Cache A Module, And Allows To Check If It Has Been Updated.
 * @param {string} mod The path to the module to look into.
 * @param {_depack.Cache} cache The current cache object, where modules (first arg) are keys, and { `mtime`, `hash` } are properties.
 * @param {!Function} [log] The function to use to print updated bits of hash, such as sources.
 * @returns {_depack.CacheResult}
 */
function compare(mod, cache, log) {
  return _compare(mod, cache, log)
}

module.exports = compare

/* typal types/index.xml closure noSuppress */
/**
 * @typedef {_depack.Cache} Cache Interface for the cache object.
 */
/**
 * @typedef {!Object<string, _depack.CacheEntry>} _depack.Cache Interface for the cache object.
 */
/**
 * @typedef {_depack.CacheEntry} CacheEntry A single entry in the cache.
 */
/**
 * @typedef {Object} _depack.CacheEntry A single entry in the cache.
 * @prop {number} mtime The `mtime` of the source file.
 * @prop {!Array<string>} hash The analysis array containing strings with internal, external and built-in dependencies and their versions.
 */
/**
 * @typedef {_depack.CacheResult} CacheResult The return type of the program.
 */
/**
 * @typedef {Object} _depack.CacheResult The return type of the program.
 * @prop {boolean} result Whether the result of the comparison was successful.
 * @prop {string} reason The reason for the failed comparison. Can be either: `NO_CACHE`, `MTIME_CHANGE`, `HASH_CHANGE`.
 * @prop {number} mtime The `mtime` of when the entry file was changed.
 * @prop {number} currentMtime The `mtime` from the cache passed to the function.
 * @prop {!Array<string>} hash The analysis array that is used for comparison and user-friendly display of what dependencies changed.
 * @prop {string} md5 The `md5` of the hash array.
 */
