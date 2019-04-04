const { createHash } = require('crypto');
const { compareHash, analyse } = require('./lib');

/**
 * Computes Necessary Information To Cache A Module, And Allows To Check If It Has Been Updated.
 * @param {string} mod The path to the module to look into.
 * @param {Object<string, {mtime:string,hash:Array<string>}>} cache The current cache.
 * @param {function} log The function to use to print updated bits of hash, such as sources.
 */
const compare = async (mod, cache = {}, log = console.log) => {
  const current = cache[mod]
  const { mtime, hash } = await analyse(mod)

  const md5 = createHash('md5').update(JSON.stringify(hash)).digest("hex")

  if (!current) return {
    result: false, reason: 'NO_CACHE', mtime, hash, md5,
  }

  const {
    'mtime': currentMtime,
    'hash': currentHash,
  } = current

  if (mtime != currentMtime) return {
    result: false, reason: 'MTIME_CHANGE', mtime, hash, currentMtime, md5,
  }
  const isHashSame = compareHash(currentHash, hash, log)
  if (isHashSame ) return { result: true, md5 }


  return { result: false, mtime, hash, reason: 'HASH_CHANGE', md5 }
}

module.exports=compare