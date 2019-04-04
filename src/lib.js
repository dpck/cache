import staticAnalysis from 'static-analysis'
import resolveDependency from 'resolve-dependency'
import { c } from 'erte'
import { lstat } from 'fs'
import makePromise from 'makepromise'

export const compareHash = (currentHash, hash, log = console.log) => {
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
  let mmeta = ''
  if (meta) {
    mmeta = /^\d+$/.test(meta) ? new Date(parseInt(meta)).toLocaleString() : meta
  }
  return { entry, mmeta }
}

export const getMtime = async (entry) => {
  /** @type {import('fs').Stats} */
  const stat = await makePromise(lstat, entry)
  const mtime = stat.mtime
  return mtime.getTime()
}

export const computeHash = async (analysis) => {
  const hash = await Promise.all(analysis.map(async ({ entry, name, internal, version }) => {
    if (name) return `${name} ${version}`
    if (internal) return internal
    const mtime = await getMtime(entry)
    return `${entry} ${mtime}`
  }))
  return hash
}


export const analyse = async (mod) => {
  const analysis = await staticAnalysis(mod, {
    shallow: true,
    soft: true,
  })
  const hash = await computeHash(analysis)

  const { path: mmod } = await resolveDependency(mod)
  const mmtime = await getMtime(mmod)

  return { mtime: mmtime, hash, analysis }
}