/* alanode example/ */
import cache from '../src'

(async () => {
  const res = await cache({
    text: 'example',
  })
  console.log(res)
})()