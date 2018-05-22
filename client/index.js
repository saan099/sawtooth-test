
//Creating private key
const {createContext, CryptoFactory} = require('sawtooth-sdk/signing')

const context = createContext('secp256k1')
const privateKey = context.newRandomPrivateKey()

const restapiURL='http://localhost:8024'
const signer =new CryptoFactory(context).newSigner(privateKey)
console.info("Signer ",signer)
console.log("priv- ",privateKey)

console.log("First signature- ",signer.sign("abcdefgh"))

var hexPriv=privateKey.asHex();

console.log("In hexadecimal?- ",hexPriv)
var decodedPriv=Buffer.from(hexPriv,'hex')


var privateBuffer = {
    privateKeyBytes: decodedPriv
  }
  console.log("after decoding hexadecimal- ",privateBuffer)

var signer1 = new CryptoFactory(context).newSigner(privateBuffer);
console.log("Signer-",signer1);
console.log("Second signature- ",signer1.sign("abcdefgh"))



//Encoding of Payload
const cbor = require('cbor')

const payload = {
    Verb: 'set',
    Name: 'foo',
    Value: 42
}
//const payloadBytes =Buffer.from(JSON.stringify(payload))
const payloadBytes = cbor.encode(payload)

console.log("payload Bytes-",payloadBytes)



const {createHash} = require('crypto')
const {protobuf} = require('sawtooth-sdk')

const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    familyName: 'transfer-chain',
    familyVersion: '1.0',
    inputs: [],
    nonce:getNonce(),
    outputs: [],
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex'),
    signerPublicKey: signer.getPublicKey().asHex()
    // In this example, we're signing the batch with the same private key,
    // but the batch can be signed by another party, in which case, the
    // public key will need to be associated with that key.
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
    transactions: transactions,
    trace:true
    
});

const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
}).finish()

console.log("BatchListAsbytes- ",batchListBytes)

const request = require('request')

request.post({
    url: restapiURL+'/batches',
    body: batchListBytes,
    headers: {'Content-Type': 'application/octet-stream'}
}, (err, response) => {
    if (err) return console.log(err)
    console.log(response.body)
})


function getNonce() {
    var dateString = Date.now().toString(36).slice(-5);
    var randomString = Math.floor(Math.random() * 46655).toString(36);
    return dateString + ('00' + randomString).slice(-3);
}

