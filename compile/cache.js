#!/usr/bin/env node
             
const _crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');
const _module = require('module');
const stream = require('stream');             
const {createHash:r} = _crypto;
const t = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, u = (a, b = !1) => t(a, 2 + (b ? 1 : 0)), v = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:x} = os;
const y = /\s+at.*(?:\(|\s)(.*)\)?/, A = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, B = x(), C = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, g = c.join("|"), f = new RegExp(A.source.replace("IGNORED_MODULES", g));
  return a.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(y);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(d);
  }).filter(d => d.trim()).map(d => b ? d.replace(y, (h, e) => h.replace(e, e.replace(B, "~"))) : d).join("\n");
};
function D(a, b, c = !1) {
  return function(g) {
    var f = v(arguments), {stack:d} = Error();
    const h = t(d, 2, !0), e = (d = g instanceof Error) ? g.message : g;
    f = [`Error: ${e}`, ...null !== f && a === f || c ? [b] : [h, b]].join("\n");
    f = C(f);
    return Object.assign(d ? g : Error(), {message:e, stack:f});
  };
}
;function E(a) {
  var {stack:b} = Error();
  const c = v(arguments);
  b = u(b, a);
  return D(c, b, a);
}
;function F(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function G(a, b, c) {
  const g = E(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:f} = a;
  if (!f) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((d, h) => {
    const e = (k, l) => k ? (k = g(k), h(k)) : d(c || l);
    let m = [e];
    Array.isArray(b) ? (b.forEach((k, l) => {
      F(f, l);
    }), m = [...b, e]) : 1 < Array.from(arguments).length && (F(f, 0), m = [b, e]);
    a(...m);
  });
}
;const {createReadStream:H, lstat:I} = fs;
const J = async a => {
  try {
    return await G(I, a);
  } catch (b) {
    return null;
  }
};
const {dirname:K, join:L, relative:M, resolve:N} = path;
const P = async(a, b) => {
  b && (b = K(b), a = L(b, a));
  var c = await J(a);
  b = a;
  let g = !1;
  if (!c) {
    if (b = await O(a), !b) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (c.isDirectory()) {
      c = !1;
      let f;
      a.endsWith("/") || (f = b = await O(a), c = !0);
      if (!f) {
        b = await O(L(a, "index"));
        if (!b) {
          throw Error(`${c ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        g = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? M("", b) : b, j:g};
}, O = async a => {
  a = `${a}.js`;
  let b = await J(a);
  b || (a = `${a}x`);
  if (b = await J(a)) {
    return a;
  }
};
const {builtinModules:Q} = _module;
const {Writable:aa} = stream;
const ba = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class ca extends aa {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...g} = a || {}, {g:f = E(!0), proxyError:d} = a || {}, h = (e, m) => f(m);
    super(g);
    this.a = [];
    this.c = new Promise((e, m) => {
      this.on("finish", () => {
        let k;
        b ? k = Buffer.concat(this.a) : k = this.a.join("");
        e(k);
        this.a = [];
      });
      this.once("error", k => {
        if (-1 == k.stack.indexOf("\n")) {
          h`${k}`;
        } else {
          const l = C(k.stack);
          k.stack = l;
          d && h`${k}`;
        }
        m(k);
      });
      c && ba(this, c).pipe(this);
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
const da = async a => {
  ({f:a} = new ca({rs:a, g:E(!0)}));
  return await a;
};
async function R(a) {
  a = H(a);
  return await da(a);
}
;function S(a, b) {
  var c = ["q", "from"];
  const g = [];
  b.replace(a, (f, ...d) => {
    f = d.slice(0, d.length - 2).reduce((h, e, m) => {
      m = c[m];
      if (!m || void 0 === e) {
        return h;
      }
      h[m] = e;
      return h;
    }, {});
    g.push(f);
  });
  return g;
}
;const ea = /^ *import(?:\s+(?:[^\s,]+)\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+(['"])(.+?)\1/gm, fa = /^ *import\s+(?:.+?\s*,\s*)?\*\s+as\s+.+?\s+from\s+(['"])(.+?)\1/gm, ha = /^ *import\s+(['"])(.+?)\1/gm, ia = /^ *export\s+(?:{[^}]+?}|\*)\s+from\s+(['"])(.+?)\1/gm, ja = a => [ea, fa, ha, ia].reduce((b, c) => {
  c = S(c, a).map(g => g.from);
  return [...b, ...c];
}, []);
const T = async(a, b, c = {}) => {
  const {fields:g, soft:f = !1} = c;
  var d = L(a, "node_modules", b);
  d = L(d, "package.json");
  const h = await J(d);
  if (h) {
    a = await ka(d, g);
    if (void 0 === a) {
      throw Error(`The package ${M("", d)} does export the module.`);
    }
    if (!a.entryExists && !f) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:e, version:m, packageName:k, main:l, entryExists:n, ...p} = a;
    return {entry:M("", e), packageJson:M("", d), ...m ? {version:m} : {}, packageName:k, ...l ? {hasMain:!0} : {}, ...n ? {} : {entryExists:!1}, ...p};
  }
  if ("/" == a && !h) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return T(L(N(a), ".."), b, c);
}, ka = async(a, b = []) => {
  const c = await R(a);
  let g, f, d, h, e;
  try {
    ({module:g, version:f, name:d, main:h, ...e} = JSON.parse(c)), e = b.reduce((k, l) => {
      k[l] = e[l];
      return k;
    }, {});
  } catch (k) {
    throw Error(`Could not parse ${a}.`);
  }
  a = K(a);
  b = g || h;
  if (!b) {
    if (!await J(L(a, "index.js"))) {
      return;
    }
    b = h = "index.js";
  }
  a = L(a, b);
  let m;
  try {
    ({path:m} = await P(a)), a = m;
  } catch (k) {
  }
  return {entry:a, version:f, packageName:d, main:!g && h, entryExists:!!m, ...e};
};
const U = a => /^[./]/.test(a), V = async(a, b, c, g, f = null) => {
  const d = E(), h = K(a);
  b = b.map(async e => {
    if (Q.includes(e)) {
      return {internal:e};
    }
    if (/^[./]/.test(e)) {
      try {
        var {path:m} = await P(e, a);
        return {entry:m, package:f};
      } catch (k) {
      }
    } else {
      {
        let [n, p, ...q] = e.split("/");
        !n.startsWith("@") && p ? (q = [p, ...q], p = n) : p = n.startsWith("@") ? `${n}/${p}` : n;
        m = {name:p, paths:q.join("/")};
      }
      const {name:k, paths:l} = m;
      if (l) {
        const {packageJson:n, packageName:p} = await T(h, k);
        e = K(n);
        ({path:e} = await P(L(e, l)));
        return {entry:e, package:p};
      }
    }
    try {
      const {entry:k, packageJson:l, version:n, packageName:p, hasMain:q, ...w} = await T(h, e, {fields:g});
      return p == f ? (console.warn("[static-analysis] Skipping package %s that imports itself in %s", p, a), null) : {entry:k, packageJson:l, version:n, name:p, ...q ? {hasMain:q} : {}, ...w};
    } catch (k) {
      if (c) {
        return null;
      }
      throw d(k);
    }
  });
  return (await Promise.all(b)).filter(Boolean);
}, W = async(a, b = {}, {nodeModules:c = !0, shallow:g = !1, soft:f = !1, fields:d = [], package:h} = {}) => {
  if (a in b) {
    return [];
  }
  b[a] = 1;
  var e = await R(a), m = ja(e);
  e = la(e);
  m = c ? m : m.filter(U);
  e = c ? e : e.filter(U);
  let k;
  try {
    const l = await V(a, m, f, d, h), n = await V(a, e, f, d, h);
    n.forEach(p => {
      p.required = !0;
    });
    k = [...l, ...n];
  } catch (l) {
    throw l.message = `${a}\n [!] ${l.message}`, l;
  }
  h = k.map(l => ({...l, from:a}));
  return await k.filter(({entry:l}) => l && !(l in b)).reduce(async(l, {entry:n, hasMain:p, packageJson:q, name:w, package:ma}) => {
    if (q && g) {
      return l;
    }
    l = await l;
    w = (await W(n, b, {nodeModules:c, shallow:g, soft:f, fields:d, package:w || ma})).map(z => ({...z, from:z.from ? z.from : n, ...!z.packageJson && p ? {hasMain:p} : {}}));
    return [...l, ...w];
  }, h);
}, la = a => S(/(?:^|[^\w\d_])require\(\s*(['"])(.+?)\1\s*\)/gm, a).map(b => b.from);
const na = async a => {
  const b = E();
  ({path:a} = await P(a));
  const {nodeModules:c = !0, shallow:g = !1, soft:f = !1, fields:d = []} = {shallow:!0, soft:!0};
  let h;
  try {
    h = await W(a, {}, {nodeModules:c, shallow:g, soft:f, fields:d});
  } catch (e) {
    throw b(e);
  }
  return h.filter(({internal:e, entry:m}, k) => e ? h.findIndex(({internal:l}) => l == e) == k : h.findIndex(({entry:l}) => m == l) == k).map(e => {
    const {entry:m, internal:k} = e, l = h.filter(({internal:n, entry:p}) => {
      if (k) {
        return k == n;
      }
      if (m) {
        return m == p;
      }
    }).map(({from:n}) => n).filter((n, p, q) => q.indexOf(n) == p);
    return {...e, from:l};
  }).map(({package:e, ...m}) => e ? {package:e, ...m} : m);
};
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const oa = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90};
function X(a, b) {
  return (b = oa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const pa = (a, b, c = console.log) => {
  const g = [], f = [];
  b.forEach(d => {
    a.includes(d) || g.push(d);
  });
  a.forEach(d => {
    b.includes(d) || f.push(d);
  });
  if (!g.length && !f.length) {
    return !0;
  }
  g.forEach(d => {
    const {entry:h, b:e} = Y(d);
    c(X("+", "green"), h, e);
  });
  f.forEach(d => {
    const {entry:h, b:e} = Y(d);
    c(X("-", "red"), h, e);
  });
  return !1;
}, Y = a => {
  const [b, c] = a.split(" ");
  a = "";
  c && (a = /^\d+$/.test(c) ? (new Date(parseInt(c, 10))).toLocaleString() : c);
  return {entry:b, b:a};
}, Z = async a => (await G(I, a)).mtime.getTime(), qa = async a => await Promise.all(a.map(async({entry:b, name:c, internal:g, version:f}) => {
  if (c) {
    return `${c} ${f}`;
  }
  if (g) {
    return g;
  }
  c = await Z(b);
  return `${b} ${c}`;
})), ra = async a => {
  const b = await na(a), c = await qa(b);
  ({path:a} = await P(a));
  return {mtime:await Z(a), hash:c, h:b};
};
module.exports = async(a, b = {}, c = console.log) => {
  b = b[a];
  const {mtime:g, hash:f} = await ra(a);
  a = r("md5").update(JSON.stringify(f)).digest("hex");
  if (!b) {
    return {result:!1, reason:"NO_CACHE", mtime:g, hash:f, md5:a};
  }
  const {mtime:d, hash:h} = b;
  return g != d ? {result:!1, reason:"MTIME_CHANGE", mtime:g, hash:f, i:d, md5:a} : pa(h, f, c) ? {result:!0, md5:a} : {result:!1, mtime:g, hash:f, reason:"HASH_CHANGE", md5:a};
};


//# sourceMappingURL=cache.js.map