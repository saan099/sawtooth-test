# sawtooth-test(Nodejs&Golang)

## Purpose
 
Simulate and check Golang transaction processor and client's transactional communication.

## Prerequsites 

1) node version 8.4.0>= & <9.0.0
2) docker compose installed

## Start Docker network

In root directory-
```
docker-compose up
```

## Build & Start Processor

```
cd tp
docker build -t my-tp .
docker run -it --network my_myblockchain my-tp
```

## Do a transaction

```
cd client
npm install
node index
```

note:- check the validator and rest api URLS


