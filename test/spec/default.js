import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import cache from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof cache, 'function')
  },
  async 'calls package without error'() {
    await cache()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await cache({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T