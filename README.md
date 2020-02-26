# @depack/cache

[![npm version](https://badge.fury.io/js/%40depack%2Fcache.svg)](https://www.npmjs.com/package/@depack/cache)
![Node.js CI](https://github.com/dpck/cache/workflows/Node.js%20CI/badge.svg)

`@depack/cache` Computes Necessary Information To Cache A Module, And Allows To Check If It Has Been Updated. Does so with static analysis of source (mtimes), Node.JS built-ins (names) and package dependencies (versions).

```sh
yarn add @depack/cache
npm i @depack/cache
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`async compare(path: string, cache=: !Cache, log=: !Function): !CacheResult`](#async-comparepath-stringcache-cachelog-function-cacheresult)
  * [`Cache`](#type-cache)
  * [`CacheEntry`](#type-cacheentry)
  * [`CacheResult`](#type-cacheresult)
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

## <code>async <ins>compare</ins>(</code><sub><br/>&nbsp;&nbsp;`path: string,`<br/>&nbsp;&nbsp;`cache=: !Cache,`<br/>&nbsp;&nbsp;`log=: !Function,`<br/></sub><code>): <i>!CacheResult</i></code>
Checks the entry file's `mtime`, calculates its dependencies and compare against the values stored in the cache object. When the result is negative, the cache object must be updated with the result returned by the function.

 - <kbd><strong>path*</strong></kbd> <em>`string`</em>: The path to the JS file.
 - <kbd>cache</kbd> <em><code><a href="#type-cache" title="Interface for the cache object.">!Cache</a></code></em> (optional): Current cache object.
 - <kbd>log</kbd> <em>`!Function`</em> (optional): The function used to display what changes have been made to the dependencies.

<code>!Object&lt;string, <a href="#type-cacheentry" title="A single entry in the cache.">CacheEntry</a>&gt;</code> __<a name="type-cache">`Cache`</a>__: Interface for the cache object.


__<a name="type-cacheentry">`CacheEntry`</a>__: A single entry in the cache.


|    Name    |             Type              |                                                 Description                                                 |
| ---------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| __mtime*__ | <em>number</em>               | The `mtime` of the source file.                                                                             |
| __hash*__  | <em>!Array&lt;string&gt;</em> | The analysis array containing strings with internal, external and built-in dependencies and their versions. |


__<a name="type-cacheresult">`CacheResult`</a>__: The return type of the program.


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
{
  result: false,
  reason: 'NO_CACHE',
  mtime: 1554399982000,
  hash: [
    'os',
    'example/source/dep.js 1554389422000',
    'static-analysis 2.1.1',
    'myPackage 1.0.0'
  ],
  md5: '980d26e614a016566682df0ddd47bb6f'
}
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
{
  result: false,
  reason: 'MTIME_CHANGE',
  mtime: 1582738528000,
  hash: [
    'os',
    'example/source/dep.js 1554389422000',
    'static-analysis 2.1.1',
    'myPackage 1.0.0'
  ],
  currentMtime: 1582738527000,
  md5: '980d26e614a016566682df0ddd47bb6f'
}
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
```diff
+ example/temp/source/dep.js 2/26/2020, 20:35:29
+ myPackage 1.0.1
+ path 
- example/temp/source/dep.js 2/26/2020, 20:35:28
- myPackage 1.0.0
```


```js
{
  result: false,
  mtime: 1582738528000,
  hash: [
    'os',
    'example/temp/source/dep.js 1582738529000',
    'static-analysis 2.1.1',
    'myPackage 1.0.1',
    'path'
  ],
  reason: 'HASH_CHANGE',
  md5: 'c1c71249126eb58269b22281b14a8568'
}
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/5.svg?sanitize=true">
</a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://www.artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://www.artd.eco">Art Deco™</a> for <a href="https://artd.eco/depack">Depack</a> 2020</th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>