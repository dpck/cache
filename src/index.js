import { createHash } from 'crypto'
import { compareHash, analyse } from './lib'

/** @type {_depack.compare} */
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

export default compare

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').compare} _depack.compare
 */