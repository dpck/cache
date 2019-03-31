import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import cache from '../../src'

// export default
makeTestSuite('test/result', {
  async getResults(input) {
    const res = await cache({
      text: input,
    })
    return res
  },
  context: Context,
})