# sawtooth-test

## Purpose
 
Simulate and check transaction processor and client's transactional communication.

## Prerequsites 

1) node version 8.4.0>= & <9.0.0
2) docker compose installed

## Start Docker network

In root directory-
```
docker-compose up
```

## Start Processor

```
cd transcation\ processor
npm install
node index
```

## Do a transaction

```
cd client
npm install
node index
```

note:- check the validator and rest api URLS


