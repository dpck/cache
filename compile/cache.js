#!/usr/bin/env node
             
const _crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');
const _module = require('module');
const stream = require('stream');             
const t = _crypto.createHash;
const u = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, v = (a, b = !1) => u(a, 2 + (b ? 1 : 0)), w = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const x = os.homedir;
const y = /\s+at.*(?:\(|\s)(.*)\)?/, A = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, B = x(), C = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, k = c.join("|"), h = new RegExp(A.source.replace("IGNORED_MODULES", k));
  return a.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(y);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !h.test(d);
  }).filter(d => d.trim()).map(d => b ? d.replace(y, (m, e) => m.replace(e, e.replace(B, "~"))) : d).join("\n");
};
function F(a, b, c = !1) {
  return function(k) {
    var h = w(arguments), {stack:d} = Error();
    const m = u(d, 2, !0), e = (d = k instanceof Error) ? k.message : k;
    h = [`Error: ${e}`, ...null !== h && a === h || c ? [b] : [m, b]].join("\n");
    h = C(h);
    return Object.assign(d ? k : Error(), {message:e, stack:h});
  };
}
;function G(a) {
  var {stack:b} = Error();
  const c = w(arguments);
  b = v(b, a);
  return F(c, b, a);
}
;async function H(a, b, c) {
  const k = G(!0);
  if ("function" != typeof a) {
    throw Error("Function must be passed.");
  }
  if (!a.length) {
    throw Error(`Function${a.name ? ` ${a.name}` : ""} does not accept any arguments.`);
  }
  return await new Promise((h, d) => {
    const m = (f, g) => f ? (f = k(f), d(f)) : h(c || g);
    let e = [m];
    Array.isArray(b) ? e = [...b, m] : 1 < Array.from(arguments).length && (e = [b, m]);
    a(...e);
  });
}
;const I = fs.createReadStream, J = fs.lstat;
const K = async a => {
  try {
    return await H(J, a);
  } catch (b) {
    return null;
  }
};
const L = path.dirname, M = path.join, aa = path.parse, N = path.relative, ba = path.resolve;
const P = async(a, b) => {
  b && (b = L(b), a = M(b, a));
  var c = await K(a);
  b = a;
  let k = !1;
  if (!c) {
    if (b = await O(a), !b) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (c.isDirectory()) {
      c = !1;
      let h;
      a.endsWith("/") || (h = b = await O(a), c = !0);
      if (!h) {
        b = await O(M(a, "index"));
        if (!b) {
          throw Error(`${c ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        k = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? N("", b) : b, j:k};
}, O = async a => {
  a = `${a}.js`;
  let b = await K(a);
  b || (a = `${a}x`);
  if (b = await K(a)) {
    return a;
  }
};
const ca = _module.builtinModules;
const da = stream.Writable;
const ea = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class fa extends da {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...k} = a || {}, {g:h = G(!0), proxyError:d} = a || {}, m = (e, f) => h(f);
    super(k);
    this.a = [];
    this.c = new Promise((e, f) => {
      this.on("finish", () => {
        let g;
        b ? g = Buffer.concat(this.a) : g = this.a.join("");
        e(g);
        this.a = [];
      });
      this.once("error", g => {
        if (-1 == g.stack.indexOf("\n")) {
          m`${g}`;
        } else {
          const n = C(g.stack);
          g.stack = n;
          d && m`${g}`;
        }
        f(g);
      });
      c && ea(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.a.push(a);
    c();
  }
  get f() {
    return this.c;
  }
}
const ha = async a => {
  ({f:a} = new fa({rs:a, g:G(!0)}));
  return await a;
};
async function Q(a) {
  a = I(a);
  return await ha(a);
}
;function R(a, b) {
  var c = ["q", "from"];
  const k = [];
  b.replace(a, (h, ...d) => {
    h = d.slice(0, d.length - 2).reduce((m, e, f) => {
      f = c[f];
      if (!f || void 0 === e) {
        return m;
      }
      m[f] = e;
      return m;
    }, {});
    k.push(h);
  });
  return k;
}
;const ia = /^ *import(?:\s+(?:[^\s,]+)\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+(['"])(.+?)\1/gm, ja = /^ *import\s+(?:.+?\s*,\s*)?\*\s+as\s+.+?\s+from\s+(['"])(.+?)\1/gm, ka = /^ *import\s+(['"])(.+?)\1/gm, la = /^ *export\s+(?:{[^}]+?}|\*)\s+from\s+(['"])(.+?)\1/gm, ma = a => [ia, ja, ka, la].reduce((b, c) => {
  c = R(c, a).map(k => k.from);
  return [...b, ...c];
}, []);
let S;
const T = async(a, b, c = {}) => {
  S || ({root:S} = aa(process.cwd()));
  const {fields:k, soft:h = !1} = c;
  var d = M(a, "node_modules", b);
  d = M(d, "package.json");
  const m = await K(d);
  if (m) {
    a = await na(d, k);
    if (void 0 === a) {
      throw Error(`The package ${N("", d)} does export the module.`);
    }
    if (!a.entryExists && !h) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:e, version:f, packageName:g, main:n, entryExists:p, ...l} = a;
    return {entry:N("", e), packageJson:N("", d), ...f ? {version:f} : {}, packageName:g, ...n ? {hasMain:!0} : {}, ...p ? {} : {entryExists:!1}, ...l};
  }
  if (a == S && !m) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return T(M(ba(a), ".."), b, c);
}, na = async(a, b = []) => {
  const c = await Q(a);
  let k, h, d, m, e;
  try {
    ({module:k, version:h, name:d, main:m, ...e} = JSON.parse(c)), e = b.reduce((g, n) => {
      g[n] = e[n];
      return g;
    }, {});
  } catch (g) {
    throw Error(`Could not parse ${a}.`);
  }
  a = L(a);
  b = k || m;
  if (!b) {
    if (!await K(M(a, "index.js"))) {
      return;
    }
    b = m = "index.js";
  }
  a = M(a, b);
  let f;
  try {
    ({path:f} = await P(a)), a = f;
  } catch (g) {
  }
  return {entry:a, version:h, packageName:d, main:!k && m, entryExists:!!f, ...e};
};
const U = a => /^[./]/.test(a), V = async(a, b, c, k, h = null) => {
  const d = G(), m = L(a);
  b = b.map(async e => {
    if (ca.includes(e)) {
      return {internal:e};
    }
    if (/^[./]/.test(e)) {
      try {
        var {path:f} = await P(e, a);
        return {entry:f, package:h};
      } catch (g) {
      }
    } else {
      {
        let [p, l, ...q] = e.split("/");
        !p.startsWith("@") && l ? (q = [l, ...q], l = p) : l = p.startsWith("@") ? `${p}/${l}` : p;
        f = {name:l, paths:q.join("/")};
      }
      const {name:g, paths:n} = f;
      if (n) {
        const {packageJson:p, packageName:l} = await T(m, g);
        e = L(p);
        ({path:e} = await P(M(e, n)));
        return {entry:e, package:l};
      }
    }
    try {
      const {entry:g, packageJson:n, version:p, packageName:l, hasMain:q, ...r} = await T(m, e, {fields:k});
      return l == h ? (console.warn("[static-analysis] Skipping package %s that imports itself in %s", l, a), null) : {entry:g, packageJson:n, version:p, name:l, ...q ? {hasMain:q} : {}, ...r};
    } catch (g) {
      if (c) {
        return null;
      }
      [e] = process.version.split(".");
      e = parseInt(e.replace("v", ""), 10);
      if (12 <= e) {
        throw g;
      }
      throw d(g);
    }
  });
  return (await Promise.all(b)).filter(Boolean);
}, W = async(a, b = {}, {nodeModules:c = !0, shallow:k = !1, soft:h = !1, fields:d = [], h:m = {}, mergeSameNodeModules:e = !0, package:f} = {}) => {
  if (a in b) {
    return [];
  }
  b[a] = 1;
  var g = await Q(a), n = ma(g);
  g = oa(g);
  n = c ? n : n.filter(U);
  g = c ? g : g.filter(U);
  try {
    const l = await V(a, n, h, d, f), q = await V(a, g, h, d, f);
    q.forEach(r => {
      r.required = !0;
    });
    var p = [...l, ...q];
  } catch (l) {
    throw l.message = `${a}\n [!] ${l.message}`, l;
  }
  f = e ? p.map(l => {
    var q = l.name, r = l.version;
    const D = l.required;
    if (q && r) {
      q = `${q}:${r}${D ? "-required" : ""}`;
      if (r = m[q]) {
        return r;
      }
      m[q] = l;
    }
    return l;
  }) : p;
  p = f.map(l => ({...l, from:a}));
  return await f.filter(({entry:l}) => l && !(l in b)).reduce(async(l, {entry:q, hasMain:r, packageJson:D, name:E, package:pa}) => {
    if (D && k) {
      return l;
    }
    l = await l;
    E = (await W(q, b, {nodeModules:c, shallow:k, soft:h, fields:d, package:E || pa, h:m, mergeSameNodeModules:e})).map(z => ({...z, from:z.from ? z.from : q, ...!z.packageJson && r ? {hasMain:r} : {}}));
    return [...l, ...E];
  }, p);
}, oa = a => R(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, a).map(b => b.from);
const qa = async a => {
  const b = G();
  a = Array.isArray(a) ? a : [a];
  a = await Promise.all(a.map(async f => {
    ({path:f} = await P(f));
    return f;
  }));
  const {nodeModules:c = !0, shallow:k = !1, soft:h = !1, fields:d = [], mergeSameNodeModules:m = !0} = {shallow:!0, soft:!0};
  let e;
  try {
    const f = {};
    e = await a.reduce(async(g, n) => {
      g = await g;
      n = await W(n, f, {nodeModules:c, shallow:k, soft:h, fields:d, mergeSameNodeModules:m});
      g.push(...n);
      return g;
    }, []);
  } catch (f) {
    [a] = process.version.split(".");
    a = parseInt(a.replace("v", ""), 10);
    if (12 <= a) {
      throw f;
    }
    throw b(f);
  }
  return e.filter(({internal:f, entry:g}, n) => f ? e.findIndex(({internal:p}) => p == f) == n : e.findIndex(({entry:p}) => g == p) == n).map(f => {
    const g = f.entry, n = f.internal, p = e.filter(({internal:l, entry:q}) => {
      if (n) {
        return n == l;
      }
      if (g) {
        return g == q;
      }
    }).map(({from:l}) => l).filter((l, q, r) => r.indexOf(l) == q);
    return {...f, from:p};
  }).map(({package:f, ...g}) => f ? {package:f, ...g} : g);
};
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const ra = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90};
function X(a, b) {
  return (b = ra[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const sa = (a, b, c = console.log) => {
  const k = [], h = [];
  b.forEach(d => {
    a.includes(d) || k.push(d);
  });
  a.forEach(d => {
    b.includes(d) || h.push(d);
  });
  if (!k.length && !h.length) {
    return !0;
  }
  k.forEach(d => {
    const {entry:m, b:e} = Y(d);
    c(X("+", "green"), m, e);
  });
  h.forEach(d => {
    const {entry:m, b:e} = Y(d);
    c(X("-", "red"), m, e);
  });
  return !1;
}, Y = a => {
  const [b, c] = a.split(" ");
  a = "";
  c && (a = /^\d+$/.test(c) ? (new Date(parseInt(c, 10))).toLocaleString() : c);
  return {entry:b, b:a};
}, Z = async a => (await H(J, a)).mtime.getTime(), ta = async a => await Promise.all(a.map(async({entry:b, name:c, internal:k, version:h}) => {
  if (c) {
    return `${c} ${h}`;
  }
  if (k) {
    return k;
  }
  c = await Z(b);
  return `${b} ${c}`;
})), ua = async a => {
  const b = await qa(a), c = await ta(b);
  ({path:a} = await P(a));
  return {mtime:await Z(a), hash:c, i:b};
};
module.exports = async(a, b = {}, c = console.log) => {
  b = b[a];
  const {mtime:k, hash:h} = await ua(a);
  a = t("md5").update(JSON.stringify(h)).digest("hex");
  if (!b) {
    return {result:!1, reason:"NO_CACHE", mtime:k, hash:h, md5:a};
  }
  const {mtime:d, hash:m} = b;
  return k != d ? {result:!1, reason:"MTIME_CHANGE", mtime:k, hash:h, currentMtime:d, md5:a} : sa(m, h, c) ? {result:!0, md5:a} : {result:!1, mtime:k, hash:h, reason:"HASH_CHANGE", md5:a};
};


//# sourceMappingURL=cache.js.map