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
    const f = 'source/index.js'
    const path = `example/temp/${f}`

    await HashExample(path, async () => {
      const p = 'source/node_modules/myPackage/package.json'
      tc.resolve(p)
      const pckg = require(`../${tc.resolve(p)}`)
      pckg.version = '1.0.1'
      await tc.write(p, JSON.stringify(pckg, null, 2))

      await new Promise(r => setTimeout(r, 1000))
      const file = await tc.read('source/dep.js')
      const fix = `import { join } from 'path'\n${file}`
      await tc.write('source/dep.js', fix)
    })
  } finally {
    await tc._destroy()
  }
})()