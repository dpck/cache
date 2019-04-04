### No Cache

The first instance is when the cache entry does not exist. The cache can be stored in a `json` file, and read with the `require` function (but the `delete require.cache[path]` must be called first), or using `fs.readFileSync` or any other read method and then parsing the cache.

_For example, given the following dir:_

`example/source/index.js`
%EXAMPLE: example/source%
`example/source/dep.js`
%EXAMPLE: example/source/dep%

_The `compare` method can be called in the following way:_

%EXAMPLE: example/no-cache, ../src => @depack/cache%

_It will return the result that indicates that the cache does not exist, and provide all information that should be written in cache so that it can be retrieved next time:_

%FORK-js example/no-cache%

%~ width="25"%