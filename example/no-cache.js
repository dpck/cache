import compare from '../src'

// returns empty cache
const readCache = () => ({})
// updates cache
const writeCache = (entry) => {
  const current = readCache()
  const updated = { ...current, ...entry }
  // fs.writeFileSync('cache.json', JSON.stringify(updated, null, 2))
}

;(async () => {
  const cache = readCache()
  const modulePath = 'example/source/index.js'
  const res = await compare(modulePath, cache)
  if (res.reason == 'NO_CACHE') {
    console.log(res)
    // do some logic
    const { mtime, hash } = res
    const cacheToWrite = {
      [modulePath]: {
        mtime, hash,
      },
    }
    writeCache(cacheToWrite)
  }
})()