# @depack/cache

[![npm version](https://badge.fury.io/js/%40depack%2Fcache.svg)](https://npmjs.org/package/@depack/cache)

`@depack/cache` Computes Necessary Information To Cache A Module, And Allows To Check If It Has Been Updated. Does so with static analysis of source (mtimes), Node.JS built-ins (names) and package dependencies (versions).

```sh
yarn add -E @depack/cache
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`compare(path: string, cache?: Cache, log?: function): Result`](#comparepath-stringcache-cachelog-function-result)
  * [`Cache`](#type-cache)
  * [`CacheEntry`](#type-cacheentry)
  * [`Result`](#type-result)
- [No Cache](#no-cache)
- [Mtime Change](#mtime-change)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import compare from '@depack/cache'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `compare(`<br/>&nbsp;&nbsp;`path: string,`<br/>&nbsp;&nbsp;`cache?: Cache,`<br/>&nbsp;&nbsp;`log?: function,`<br/>`): Result`

Checks the entry file's `mtime`, calculates its dependencies and compare against the values stored in the cache object. When the result is negative, the cache object must be updated with the result returned by the function. The `log` function is used to display what changes have been made to the dependencies.

`Object<string, CacheEntry>` __<a name="type-cache">`Cache`</a>__: Interface for the cache object.

__<a name="type-cacheentry">`CacheEntry`</a>__: A single entry in the cache.

|    Name    |         Type          |                                                 Description                                                 |
| ---------- | --------------------- | ----------------------------------------------------------------------------------------------------------- |
| __mtime*__ | _number_              | The `mtime` of the source file.                                                                             |
| __hash*__  | _Array&lt;string&gt;_ | The analysis array containing strings with internal, external and built-in dependencies and their versions. |

__<a name="type-result">`Result`</a>__: The return type of the program.

|    Name     |                       Type                        |                                              Description                                               |
| ----------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| __result*__ | _boolean_                                         | Whether the result of the comparison was successul.                                                    |
| __reason*__ | _('NO_CACHE' \| 'MTIME_CHANGE' \| 'HASH_CHANGE')_ | The reason for the failed comparison.                                                                  |
| __mtime*__  | _number_                                          | The `mtime` of when the entry file was changed.                                                        |
| __hash*__   | _Array&lt;string&gt;_                             | The analysis array that is used for comparison and user-friendly display of what dependencies changed. |
| __md5*__    | _string_                                          | The `md5` of the hash array.                                                                           |

There are multiple scenarios when using this package. Examples of each are given in the examples below.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true" width="25"></a></p>

## No Cache

The first instance is when the cache entry does not exist. The cache can be stored in a `json` file, and read with the `require` function (but the `delete require.cache[path]` must be called first), or using `fs.readFileSync` or any other read method and then parsing the cache.

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
  mtime: 1554390116000,
  hash: 
   [ 'os',
     'example/source/dep.js 1554389422000',
     'static-analysis 1.3.3' ],
  md5: '70914015974a8f1baccd4d9dc456d34b' }
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true" width="25"></a></p>

## Mtime Change

If the module's `mtime` has changed, the result will be false, with the new `mtime` returned so that it can be updated. The current implementation is coupled to `mtime` logic, therefore when transferring onto other machines via _git_ for example, the cache will fail. It might be improved in the future.

```js
let cache = {}
const { mtime, hash } = await compare(path, cache)
cache[path] = { mtime, hash }
await update()
const res = await compare(path, cache)
console.log(res)
```
```js
{ result: false,
  reason: 'MTIME_CHANGE',
  mtime: 1554395254000,
  hash: 
   [ 'os',
     'example/source/dep.js 1554389422000',
     'static-analysis 1.3.3' ],
  currentMtime: 1554395253000,
  md5: '70914015974a8f1baccd4d9dc456d34b' }
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## Copyright

(c) [Art Deco][1] 2019

[1]: https://artd.eco/depack

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>