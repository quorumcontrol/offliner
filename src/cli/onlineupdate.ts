import { Community, setDataTransaction, EcdsaKey } from 'tupelo-wasm-sdk';
import { exportLicense, importLicense } from '../index';
import { readFileSync } from 'fs';

export async function main() {
    const c = await Community.freshLocalTestCommunity()
    let [tree,state] = await importLicense(c.blockservice, "license.cbor")
    const keyBits = readFileSync("license.key")
    const key = await EcdsaKey.fromBytes(keyBits)
    tree.key = key

    state = await c.playTransactions(tree, [setDataTransaction("/updatedAt", Date.now())])
    return exportLicense(tree, state)
}

main().then(()=> {
    process.exit(0)
})

