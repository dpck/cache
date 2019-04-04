## Mtime Change

If the module's `mtime` has changed, the result will be false, with the new `mtime` returned so that it can be updated. The current implementation is coupled to `mtime` logic, therefore when transferring onto other machines via _git_ for example, the cache will fail. It might be improved in the future.

%EXAMPLE: example/mtime, ../src => @depack/cache%
%FORK-js example/mtime%

%~%