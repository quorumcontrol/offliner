import { makeLicense } from "../src/licensemaker"
import {allBlocks, exportLicense, importLicense} from "../src/index"
import { Community } from "tupelo-wasm-sdk";

const communityP = Community.freshLocalTestCommunity()

describe('export', ()=> {
    it('logs blocks', async ()=> {
        jest.setTimeout(15000);
        const c = await communityP
        const p = new Promise(async (resolve)=> {
            const [tree] = await makeLicense(c)
            const blocks = await allBlocks(tree)    
            expect(blocks).toHaveLength(6)
            resolve()
        })

        return p
    })

    it('writes a license', async ()=> {
        jest.setTimeout(15000);
        const c = await communityP
        const p = new Promise(async (resolve)=> {
            const [tree, state] = await makeLicense(c)
            await exportLicense(tree, state)
            resolve()
        })

        return p
    })

    it('reads a license', async ()=> {
        jest.setTimeout(15000);

        const c = await communityP
        const p = new Promise(async (resolve)=> {
            const [tree,state] = await makeLicense(c)
            await exportLicense(tree, state)
    
            let [retTree,retState] = await importLicense(c.blockservice, "license.cbor")
            expect(retState).toEqual(state)
            expect(retTree.tip).toEqual(tree.tip)
            resolve()
        })

       return p
    })

})