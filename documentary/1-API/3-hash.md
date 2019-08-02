## Hash Update

The hash is an array with strings that show what version of a dependency/file are used by the entry source file. They are saved in cache in the full array form rather than `md5` itself so that it is possible to log about when the changes were made and to which files. The changes will be logged using the function provided (`console.log` by default).

%EXAMPLE: example/hash, ../src => @depack/cache%
`stderr`
%FORKERR-diff example/hash%
<!-- break onto the next file to prevent parallel exec -->