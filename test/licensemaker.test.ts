import { makeLicense } from '../src/licensemaker';
import { Community } from 'tupelo-wasm-sdk';

describe('licensemaker', () => {
  it('returns a tree', async () => {

    jest.setTimeout(15000);
    const c = await Community.freshLocalTestCommunity()
    const p = new Promise(async (resolve) => {
      const [tree] = await makeLicense(c)
      console.log(tree.tip)

      const did = await tree.id()
      expect(did).toMatch(/did\:tupelo\:.+/)
      const resp = await tree.resolveData("/license")
      expect(resp.value.orderId).toEqual("order-123-123-123")
      resolve()
    })

    p.then(c.stop)
    return p
  });
});


