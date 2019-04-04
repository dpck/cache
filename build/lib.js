let staticAnalysis = require('static-analysis'); if (staticAnalysis && staticAnalysis.__esModule) staticAnalysis = staticAnalysis.default;
let resolveDependency = require('resolve-dependency'); if (resolveDependency && resolveDependency.__esModule) resolveDependency = resolveDependency.default;
const { c } = require('erte');
const { lstat } = require('fs');
let makePromise = require('makepromise'); if (makePromise && makePromise.__esModule) makePromise = makePromise.default;

       const compareHash = (currentHash, hash, log = console.log) => {
  const added = []
  const removed = []
  hash.forEach((mm) => {
    if (!currentHash.includes(mm)) {
      added.push(mm)
    }
  })
  currentHash.forEach((mm) => {
    if (!hash.includes(mm)) {
      removed.push(mm)
    }
  })
  const changed = added.length || removed.length

  if (!changed) return true
  added.forEach((mm) => {
    const { entry, mmeta } = getMetaToPrint(mm)
    log(c('+', 'green'), entry, mmeta)
  })
  removed.forEach((mm) => {
    const { entry, mmeta } = getMetaToPrint(mm)
    log(c('-', 'red'), entry, mmeta)
  })
  return false
}

const getMetaToPrint = (mm) => {
  const [entry, meta] = mm.split(' ')
  let mmeta
  if (meta) {
    mmeta = /^\d+$/.test(meta) ? new Date(parseInt(meta)).toLocaleString() : meta
  }
  return { entry, mmeta }
}

       const getMtime = async (entry) => {
  /** @type {import('fs').Stats} */
  const stat = await makePromise(lstat, entry)
  const mtime = stat.mtime
  return mtime.getTime()
}

       const computeHash = async (analysis) => {
  const hash = await Promise.all(analysis.map(async ({ entry, name, internal, version }) => {
    if (name) return `${name} ${version}`
    if (internal) return internal
    const mtime = await getMtime(entry)
    return `${entry} ${mtime}`
  }))
  return hash
}


       const analyse = async (mod) => {
  const analysis = await staticAnalysis(mod, {
    shallow: true,
    soft: true,
  })
  const hash = await computeHash(analysis)

  const { path: mmod } = await resolveDependency(mod)
  const mmtime = await getMtime(mmod)

  return { mtime: mmtime, hash, analysis }
}

module.exports.compareHash = compareHash
module.exports.getMtime = getMtime
module.exports.computeHash = computeHash
module.exports.analyse = analyse