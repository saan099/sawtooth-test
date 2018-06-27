# sawtooth-test(Python-TP)

## Purpose
 
Simulate and check Python based transaction processor and client's transactional communication.

## Prerequsites 

1) node version 8.4.0>= & <9.0.0
2) docker compose installed
3) protobuf installed(version 3).

## Build Python proto files 

In root directory-
```
protoc -I=./proto --python_out=./tp/python_proto  ./proto/mydata.proto
``` 

## Start Docker network

In root directory-
```
docker-compose up
```

## Do a transaction

```
cd client
npm install
node index
```

note:- check the validator and rest api URLS


