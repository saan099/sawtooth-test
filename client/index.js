
//Creating private key
const {createContext, CryptoFactory} = require('sawtooth-sdk/signing')

const context = createContext('secp256k1')
const privateKey = context.newRandomPrivateKey()


const signer =new CryptoFactory(context).newSigner(privateKey)
console.info("Signer ",signer)
console.log("priv- ",privateKey)

console.log("First encryption- ",signer.sign("abcdefgh"))

var hexPriv=privateKey.asHex();

console.log("In hexadecimal?- ",hexPriv)
var decodedPriv=Buffer.from(hexPriv,'hex')


var privateBuffer = {
    privateKeyBytes: decodedPriv
  }
  console.log("after decoding hexadecimal- ",privateBuffer)

var signer1 = new CryptoFactory(context).newSigner(privateBuffer);
console.log("Signer-",signer1);
console.log("Second encryption- ",signer1.sign("abcdefgh"))



//Encoding of Payload
const cbor = require('cbor')

const payload = {
    Verb: 'set',
    Name: 'foo',
    Value: 42
}
const payloadBytes =Buffer.from(JSON.stringify(payload))
//const payloadBytes = cbor.encode(payload)

console.log("payload Bytes-",payloadBytes)



const {createHash} = require('crypto')
const {protobuf} = require('sawtooth-sdk')

const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: 'transfer-chain',
    familyVersion: '1.0',
    inputs: [],
    outputs: [],
    signerPublicKey: signer.getPublicKey().asHex(),
    // In this example, we're signing the batch with the same private key,
    // but the batch can be signed by another party, in which case, the
    // public key will need to be associated with that key.
    batcherPublicKey: signer.getPublicKey().asHex(),
    // In this example, there are no dependencies.  This list should include
    // an previous transaction header signatures that must be applied for
    // this transaction to successfully commit.
    // For example,
    // dependencies: ['540a6803971d1880ec73a96cb97815a95d374cbad5d865925e5aa0432fcf1931539afe10310c122c5eaae15df61236079abbf4f258889359c4d175516934484a'],
    dependencies: [],
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
}).finish()

console.log("Transaction header- ",transactionHeaderBytes)



const signature = signer.sign(transactionHeaderBytes)

const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: signature,
    payload: payloadBytes
})


console.log("Transaction- ",transaction);

const transactions = [transaction]

const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
}).finish()

console.log("batch header bytes- ",batchHeaderBytes);


const batchSignature = signer.sign(batchHeaderBytes)

const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: batchSignature,
    transactions: transactions
});

const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
}).finish()

console.log("BatchListAsbytes- ",batchListBytes)

const request = require('request')

request.post({
    url: 'http://localhost:8024/batches',
    body: batchListBytes,
    headers: {'Content-Type': 'application/octet-stream'}
}, (err, response) => {
    if (err) return console.log(err)
    console.log(response.body)
})


