import TempContext from 'temp-context'
import compare from '../src'

const tc = new TempContext()
tc._TEMP = 'example/temp'

const HashExample = async (path, update) => {
  /* start example */
  let cache = {}
  const { mtime, hash } = await compare(path, cache)
  cache[path] = { mtime, hash }
  await update()
  const res = await compare(path, cache)
  console.log(res)
  /* end example */
}


;(async () => {
  try {
    await tc._init()
    await tc.add('example/source')
    const f = 'source/index2.js'
    const path = `example/temp/${f}`
    const file = await tc.read(f)
    const fix = file.replace('\'./dep\'', '\'../../source/dep\'')
    await tc.write(f, fix)
    await HashExample(path, async () => {
      const p = 'source/node_modules/myPackage/package.json'
      tc.resolve(p)
      const pckg = require(`../${tc.resolve(p)}`)
      pckg.version = '1.0.1'
      await tc.write(p, JSON.stringify(pckg, null, 2))
    })
  } finally {
    await tc._destroy()
  }
})()