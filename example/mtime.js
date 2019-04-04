import TempContext from 'temp-context'
import compare from '../src'

const tc = new TempContext()
tc._TEMP = 'example/temp'

const MtimeExample = async (path, update) => {
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
    const path = 'example/temp/source'
    const file = await tc.read('source/index.js')
    const fix = file.replace('\'./dep\'', '\'../../source/dep\'')
    await tc.write('source/index.js', fix)
    await MtimeExample(path, async () => {
      await new Promise(r => setTimeout(r, 1000))
      await tc.write('source/index.js', `console.log('ok')\n${fix}`)
    })
  } finally {
    await tc._destroy()
  }
})()