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
  * [`_depack.Cache`](#type-_depackcache)
  * [`_depack.CacheEntry`](#type-_depackcacheentry)
  * [`_depack.CacheResult`](#type-_depackcacheresult)
- [No Cache](#no-cache)
- [Mtime Change](#mtime-change)
- [Hash Update](#hash-update)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default function:

```js
import compare from '@depack/cache'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## `compare(`<br/>&nbsp;&nbsp;`path: string,`<br/>&nbsp;&nbsp;`cache?: Cache,`<br/>&nbsp;&nbsp;`log?: function,`<br/>`): Result`

Checks the entry file's `mtime`, calculates its dependencies and compare against the values stored in the cache object. When the result is negative, the cache object must be updated with the result returned by the function. The `log` function is used to display what changes have been made to the dependencies.

<code>!Object&lt;string, <a href="#type-_depackcacheentry" title="A single entry in the cache.">_depack.CacheEntry</a>&gt;</code> <strong><a name="type-_depackcache">`_depack.Cache`</a></strong>: Interface for the cache object.

<strong><a name="type-_depackcacheentry">`_depack.CacheEntry`</a></strong>: A single entry in the cache.

|    Name    |             Type              |                                                 Description                                                 |
| ---------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| __mtime*__ | <em>number</em>               | The `mtime` of the source file.                                                                             |
| __hash*__  | <em>!Array&lt;string&gt;</em> | The analysis array containing strings with internal, external and built-in dependencies and their versions. |

<strong><a name="type-_depackcacheresult">`_depack.CacheResult`</a></strong>: The return type of the program.

|       Name        |             Type              |                                              Description                                               |
| ----------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| __result*__       | <em>boolean</em>              | Whether the result of the comparison was successful.                                                   |
| __reason*__       | <em>string</em>               | The reason for the failed comparison. Can be either: `NO_CACHE`, `MTIME_CHANGE`, `HASH_CHANGE`.        |
| __mtime*__        | <em>number</em>               | The `mtime` of when the entry file was changed.                                                        |
| __currentMtime*__ | <em>number</em>               | The `mtime` from the cache passed to the function.                                                     |
| __hash*__         | <em>!Array&lt;string&gt;</em> | The analysis array that is used for comparison and user-friendly display of what dependencies changed. |
| __md5*__          | <em>string</em>               | The `md5` of the hash array.                                                                           |

There are multiple scenarios when using this package. Examples of each are given in the examples below.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true" width="25">
</a></p>

## No Cache

The first instance is when the cache entry does not exist. The cache can be stored in a `json` file, and read with the `require` function (but the `delete require.cache[path]` must be called first), or using `fs.readFileSync` or any other read method and then parsing the cache.

_For example, given the following dir:_

`example/source/index.js`
```js
import { homedir } from 'os'
import dep from './dep'
import staticAnalysis from 'static-analysis'
import myPackage from 'myPackage'
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
  mtime: 1554399982000,
  hash: 
   [ 'os',
     'example/source/dep.js 1554389422000',
     'static-analysis 1.7.1',
     'myPackage 1.0.0' ],
  md5: 'd6deeb6a05eacc18a57f544a99ad18c2' }
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true" width="25">
</a></p>

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
  mtime: 1564789443000,
  hash: 
   [ 'os',
     'example/source/dep.js 1554389422000',
     'static-analysis 1.7.1',
     'myPackage 1.0.0' ],
  currentMtime: 1564789442000,
  md5: 'd6deeb6a05eacc18a57f544a99ad18c2' }
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/4.svg?sanitize=true" width="25">
</a></p>

## Hash Update

The hash is an array with strings that show what version of a dependency/file are used by the entry source file. They are saved in cache in the full array form rather than `md5` itself so that it is possible to log about when the changes were made and to which files. The changes will be logged using the function provided (`console.log` by default).

```js
let cache = {}
const { mtime, hash } = await compare(path, cache)
cache[path] = { mtime, hash }
await update()
const res = await compare(path, cache, console.error)
console.log(res)
```
`stderr`
```fs
+ example/temp/source/dep.js 2019-8-3 02:44:05
+ myPackage 1.0.1
+ path 
- example/temp/source/dep.js 2019-8-3 02:44:03
- myPackage 1.0.0
```


```js
{ result: false,
  mtime: 1564789443000,
  hash: 
   [ 'os',
     'example/temp/source/dep.js 1564789445000',
     'static-analysis 1.7.1',
     'myPackage 1.0.1',
     'path' ],
  reason: 'HASH_CHANGE',
  md5: '9f4263bed0c584cbb23aebfa2dc65791' }
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/5.svg?sanitize=true">
</a></p>

## Copyright

(c) [Art Deco][1] 2019

[1]: https://artd.eco/depack

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>