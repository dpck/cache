import { createHash } from 'crypto'
import { compareHash, analyse } from './lib'

/**
 * Computes Necessary Information To Cache A Module, And Allows To Check If It Has Been Updated.
 * @param {string} mod The path to the module to look into.
 * @param {Object<string, {mtime:string,hash:Array<string>}>} cache The current cache.
 * @param {function} log The function to use to print updated bits of hash, such as sources.
 */
const compare = async (mod, cache = {}, log = console.log) => {
  const current = cache[mod]
  const { mtime, hash } = await analyse(mod)

  let currentMtime, currentHash, crypto
  if (current) {
    ({ 'mtime': currentMtime, 'hash': currentHash, 'md5': crypto } = current)
    const isHashSame = compareHash(currentHash, hash, log)
    if (isHashSame ) return { result: true, md5: crypto }
  }

  const md5 = createHash('md5').update(JSON.stringify(hash)).digest("hex")
  if (!current) return {
    result: false, reason: 'NO_CACHE', mtime, hash, md5,
  }

  if (mtime != currentMtime) return {
    result: false, reason: 'MTIME_CHANGE', mtime, hash, currentMtime, md5,
  }

  return { result: false, mtime, hash, reason: 'HASH_CHANGE', md5 }
}

export default compare