#!/usr/bin/env ts-node
import { ChainTree, EcdsaKey, Community, setDataTransaction } from 'tupelo-wasm-sdk';
import { CurrentState } from 'tupelo-messages/signatures/signatures_pb';

const licenseData = {
    "name": "New device",
    "syncAt": "2019-10-10T14:21:31.485Z",
    "license": {
        "id": 240,
        "name": "Awesome Frozen Chips",
        "active": true,
        "orderId": "c6221a28-1c4b-4b73-8277-dd310f555554",
        "licenseType": "single"
    },
    "orderId": "order-123-123-123",
    "customer": {},
    "features": [
        {
            "id": 9,
            "product": "Energy Suite"
        },
        {
            "id": 10,
            "product": "OPC UA Server"
        }
    ]
}

export const makeLicense = (community:Community) => {
    return new Promise<[ChainTree,CurrentState]>(async (resolve, reject) => {
        try {
            // create a new key for the license
            const key = await EcdsaKey.generate()
            const tree = await ChainTree.newEmptyTree(community.blockservice, key)
            // set the data of the license
            const resp = await community.playTransactions(tree, [
                setDataTransaction("/license", licenseData)
            ])
            const did = await tree.id()
            console.log("created new license: ", did)
            resolve([tree, resp])
        } catch (e) {
            reject(e)
        }
    });
};
