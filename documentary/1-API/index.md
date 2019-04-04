## API

The package is available by importing its default function:

```js
import compare from '@depack/cache'
```

%~%

```## compare => Result
[
  ["path", "string"],
  ["cache?", "Cache"],
  ["log?", "function"]
]
```

Checks the entry file's `mtime`, calculates its dependencies and compare against the values stored in the cache object. When the result is negative, the cache object must be updated with the result returned by the function. The `log` function is used to display what changes have been made to the dependencies.

%TYPEDEF types/index.xml%

%~ width="25"%