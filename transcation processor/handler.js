'use strict'

const { createHash } = require('crypto')
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
const { TransactionHeader } = require('sawtooth-sdk/protobuf')
const cbor = require('cbor')

const getAddress = (key, length = 64) => {
    return createHash('sha512').update(key).digest('hex').slice(0, length)
  }
  
const FAMILY = 'transfer-chain'
const PREFIX = getAddress(FAMILY, 6)
console.log("PREFIX- ",PREFIX);

class TestTX extends TransactionHandler {
    constructor () {
        console.log("Tx Processor initialized")
      super(FAMILY,  ['1.0'], [PREFIX])
    }

    apply (transactionProcessRequest, stateStore) {
        console.log("REACHING",transactionProcessRequest)
        let header = transactionProcessRequest.header
        let signer = header.signerPublicKey
        
        let payload=cbor.decode(transactionProcessRequest.payload)
        console.log("PAYLOAD- ",payload)
        return Promise.resolve().then(() => {
            return 'awesome'
          })

        throw new InvalidTransaction('No Function called')
      }
    
}

module.exports = {
    TestTX
  }

