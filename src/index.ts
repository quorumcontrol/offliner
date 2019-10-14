import { ChainTree, Community, IBlockService } from "tupelo-wasm-sdk";
import CID from 'cids';
import fs from 'fs';
import { CurrentState } from 'tupelo-messages/signatures/signatures_pb';

const Ipld:any = require('ipld');
const dagCBOR = require('ipld-dag-cbor');
const Block = require('ipfs-block')

export async function allBlocks(tree:ChainTree) {
  const c = await Community.freshLocalTestCommunity()

  const ipld = new Ipld({blockService: c.blockservice})

  const tips = await getTips(ipld, tree.tip)
  
  return Promise.all(tips.map((cid)=> {
    return c.blockservice.get(cid)
  }))
}

export async function exportLicense(tree:ChainTree, currentState:CurrentState) {
    const blocks = await allBlocks(tree)
    const exportedLicense = {
      state: Buffer.from(currentState.serializeBinary()),
      blocks: {} as {[index:string]: Buffer},
      tip: tree.tip,
    }

    blocks.forEach((blck)=> { 
      exportedLicense.blocks[blck.cid.toBaseEncodedString()] = blck.data 
    })

    var cborData = dagCBOR.util.serialize(exportedLicense)
    fs.writeFileSync("license.cbor", cborData)
    return
}

export async function importLicense(blockService:IBlockService, path:string):Promise<[ChainTree,CurrentState]> {
  console.log("import license")
   const bits = fs.readFileSync(path)
   const exportedLicense = dagCBOR.util.deserialize(bits)
   console.log(exportedLicense)
   const state = CurrentState.deserializeBinary(exportedLicense.state)
   for (let cidStr of Object.keys(exportedLicense.blocks)) {
     await blockService.put(new Block(exportedLicense.blocks[cidStr], new CID(cidStr), ))
   }

   return [new ChainTree({
     store: blockService,
     tip: exportedLicense.tip,
   }), state]
}

async function getTips(ipld:any, tip:CID):Promise<CID[]> {
  const tree = await ipld.tree(tip).all()

  let blocks = [tip]

  for (let path of tree) {
    if (path.split("/").length > 1) {
      continue; // for now ignore nested objects
    }

    let resp = await ipld.resolve(tip, path).first()
    if (CID.isCID(resp.value)) {
      blocks = blocks.concat(await getTips(ipld, resp.value))
    }
  }

  return blocks
}