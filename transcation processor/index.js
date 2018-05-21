'use strict'

const { TransactionProcessor } = require('sawtooth-sdk/processor')
const {TestTX} = require('./handler.js')

if (process.argv.length < 2) {
  console.log('missing a validator address')
  process.exit(1)
}

const address = process.argv[2]

const transactionProcessor = new TransactionProcessor('tcp://localhost:4020')

transactionProcessor.addHandler(new TestTX())

transactionProcessor.start()