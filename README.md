# @depack/cache

[![npm version](https://badge.fury.io/js/%40depack%2Fcache.svg)](https://npmjs.org/package/@depack/cache)

`@depack/cache` Computes Necessary Information To Cache A Module, And Allows To Check If It Has Been Updated. Does so with static analysis of source (mtimes), Node.JS built-ins (names) and package dependencies (versions).

```sh
yarn add -E @depack/cache
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`compare(path: string, cache?: object, log?: function): CompareResult`](#comparepath-stringcache-objectlog-function-compareresult)
  * [No Cache](#no-cache)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import compare from '@depack/cache'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `compare(`<br/>&nbsp;&nbsp;`path: string,`<br/>&nbsp;&nbsp;`cache?: object,`<br/>&nbsp;&nbsp;`log?: function,`<br/>`): CompareResult`

Checks the entry file's mtime, calculates its dependencies and compare against the values stored in the cache object. When the result is negative, the cache object must be updated with the result returned by the function. The `log` function is used to display what changes have been made to the dependencies.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true" width="25"></a></p>

### No Cache

There are multiple scenarios when using this package. The first instance is when the cache entry does not exist. The cache can be stored in a `json` file, and read with the `require` function (but the `delete require.cache[path]` must be called first), or using `fs.readFileSync` or any other read method and then parsing the cache.

_For example, given the following dir:_

`example/source/index.js`
```js
import { homedir } from 'os'
import dep from './dep'
import staticAnalysis from 'static-analysis'
```
`example/source/dep.js`
```js
export default () => {
  console.log('dep')
}
```

_The `compare` method can be called in the following way:_

```js
import compare from '@depack/cache'

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
```

_It will return the result that indicates that the cache does not exist, and provide all information that should be written in cache so that it can be retrieved next time:_

```js
{ result: false,
  reason: 'NO_CACHE',
  mtime: 1554389547000,
  hash: [ 'os', 'example/source/dep.js 1554389422000' ],
  md5: '4a9197d65e588322410e2a2637328eaa' }
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true" width="25"></a></p>


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## Copyright

(c) [Art Deco][1] 2019

[1]: https://artd.eco/depack

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>