import { makeLicense } from "../licensemaker";
import { Community } from 'tupelo-wasm-sdk';
import { exportLicense } from '../index';
import { writeFileSync } from 'fs';

export async function main() {
    const c = await Community.freshLocalTestCommunity()
    const [tree,state] = await makeLicense(c)
    const key = tree.key
    if (key === undefined) {
        throw new Error("undefined key")
    }
    writeFileSync("license.key", key.privateKey)
    return exportLicense(tree, state)
}

main().then(()=> {
    process.exit(0)
})

