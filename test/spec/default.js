import { equal, ok, deepEqual } from '@zoroaster/assert'
import Context from '../context'
import cache from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof cache, 'function')
  },
  async 'returns data when cache does not exist'({ write }) {
    const path = await write('module.js', `
import Stream from 'stream'
console.log('hello world')
    `)
    const res = await cache(path)
    ok(Number.isInteger(res.mtime))
    delete res.mtime
    return res
  },
  async 'returns new cache when file is updated'({ write }) {
    let path = await write('module.js', `
import Stream from 'stream'
console.log('hello world')
    `)
    const { mtime, hash } = await cache(path)
    await new Promise(r => setTimeout(r, 1000))
    path = await write('module.js', `
import Stream from 'stream'
console.log('hello world')
    `)
    const res = await cache(path, {
      [path]: { mtime, hash },
    })
    ok(Number.isInteger(res.mtime))
    ok(Number.isInteger(res.currentMtime))
    ok(res.currentMtime < res.mtime, 'Current mtime should be in the past.')
    delete res.mtime
    delete res.currentMtime
    return res
  },
  async 'returns true when not updated'({ write }) {
    let path = await write('module.js', `
import Stream from 'stream'
console.log('hello world')
    `)
    const { mtime, hash } = await cache(path)
    const res = await cache(path, {
      [path]: { mtime, hash },
    })
    return res
  },
  async 'returns hash change'({ write }) {
    await write('dep.js', 'console.log("dependency")')
    let path = await write('module.js', `
import Stream from 'stream'
import dep from './dep'
console.log('hello world')
    `)
    const { mtime, hash } = await cache(path)
    await new Promise(r => setTimeout(r, 1000))
    await write('dep.js', 'console.log("dependency changed")')
    const res = await cache(path, {
      [path]: { mtime, hash },
    })
    ok(Number.isInteger(res.mtime))
    delete res.mtime
    return res
  },
}

export default T