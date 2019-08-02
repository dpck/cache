import { join } from 'path'
import { debuglog } from 'util'
import TempContext from 'temp-context'

const LOG = debuglog('@depack/cache')

/**
 * A testing context for the package.
 */
export default class Context extends TempContext {
  /**
   * A tagged template that returns the relative path to the fixture.
   * @param {string} file
   * @example
   * fixture`input.txt` // -> test/fixture/input.txt
   */
  fixture(file) {
    const f = file.raw[0]
    return join('test/fixture', f)
  }
}